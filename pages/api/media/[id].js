import dbConnect from "../../../lib/dbConnect";
import Media from "../../../models/Media";
import { setCache, getCache, clearCache } from "../../../lib/cache";
import mongoose from "mongoose";
import fs from 'fs/promises';
import path from 'path';
import { handleFileUpload, saveMediaToDatabase } from "../../../lib/mediaUtilities";

export const config = {
  api: {
    bodyParser: false, // Disable default body parsing
  },
};

export default async function handler(req, res) {
  await dbConnect();

  const { query: { id }, method } = req;

  // Validate ID format before processing
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid media ID format" });
  }

  try {
    switch (method) {
      case "GET":
        return handleGetRequest(id, res);
      case "PUT":
        return handlePutRequest(id, req, res);
      case "DELETE":
        return handleDeleteRequest(id, res);
      default:
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error(`Error during ${method} request for media ${id}:`, error);
    return handleErrorResponse(error, res);
  }
}

// GET handler - Get single media by ID
async function handleGetRequest(id, res) {
  const cacheKey = `media-${id}`;
  const cachedMedia = getCache(cacheKey);
  if (cachedMedia) {
    console.log(`Returning cached media: ${id}`);
    return res.status(200).json(cachedMedia);
  }

  const media = await Media.findById(id);
  if (!media) {
    return res.status(404).json({ error: "Media not found" });
  }

  setCache(cacheKey, media);
  return res.status(200).json(media);
}

async function handlePutRequest(id, req, res) {
  try {
    const existingMedia = await Media.findById(id);
    if (!existingMedia) {
      return res.status(404).json({ error: "Media not found" });
    }

    const contentType = req.headers['content-type'] || '';
    
    if (contentType.includes('multipart/form-data')) {
      // Handle file upload with metadata
      const uploadResult = await handleFileUpload(req, existingMedia);
      const updatedMedia = await saveMediaToDatabase({
        ...uploadResult,
        description: uploadResult.description || existingMedia.description,
        backgroundColor: uploadResult.backgroundColor || existingMedia.backgroundColor,
        metadata: uploadResult.metadata || existingMedia.metadata
      }, id);
      return res.status(200).json(updatedMedia);
    } else if (contentType.includes('application/json')) {
      // Handle metadata-only update with potential file rename
      let body = '';
      for await (const chunk of req) {
        body += chunk.toString();
      }

      const parsedBody = JSON.parse(body);
      
      if (!parsedBody.fileName || !parsedBody.fileType) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Initialize update data
      const updateData = {
        fileName: parsedBody.fileName,
        description: parsedBody.description || existingMedia.description,
        backgroundColor: parsedBody.backgroundColor || existingMedia.backgroundColor,
        metadata: parsedBody.metadata || existingMedia.metadata,
        lastModified: new Date()
      };

      // Check if filename has changed (excluding extension changes)
      const oldFilename = path.basename(existingMedia.fileName, path.extname(existingMedia.fileName));
      const newFilename = path.basename(parsedBody.fileName, path.extname(parsedBody.fileName));
      
      if (oldFilename !== newFilename) {
        const oldExt = path.extname(existingMedia.fileName);
        const newExt = path.extname(parsedBody.fileName);
        const finalExt = newExt || oldExt;
        
        // Construct new filename with proper extension
        updateData.fileName = `${newFilename}${finalExt}`;
        
        // Build old and new paths
        const oldPath = path.join(process.cwd(), 'public', existingMedia.path);
        const newPath = path.join(
          path.dirname(oldPath),
          updateData.fileName
        );

        // Rename the physical file
        try {
          await fs.rename(oldPath, newPath);
          console.log(`Renamed file from ${oldPath} to ${newPath}`);
          
          // Update path and URL in database
          updateData.path = path.join(
            path.dirname(existingMedia.path),
            updateData.fileName
          ).replace(/\\/g, '/');
          
          updateData.url = `${process.env.NEXT_PUBLIC_BASE_URL || ''}${updateData.path}`;
        } catch (error) {
          console.error('File rename error:', error);
          return res.status(500).json({ error: "Failed to rename file" });
        }
      }

      clearCache('media');

      const updatedMedia = await Media.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      return res.status(200).json(updatedMedia);
    } else {
      return res.status(415).json({ error: "Unsupported Media Type" });
    }
  } catch (error) {
    console.error("PUT error:", error);
    return res.status(500).json({ 
      error: error.message || "Update failed",
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

// DELETE handler - Delete a media item and its file
async function handleDeleteRequest(id, res) {
  try {
    // First get the media item to access the file path
    const media = await Media.findById(id);
    if (!media) {
      return res.status(404).json({ error: "Media not found" });
    }

    // Delete the physical file
    try {
      const filePath = path.join(process.cwd(), 'public', media.path);
      await fs.unlink(filePath);
      console.log(`Deleted file: ${filePath}`);
    } catch (fileError) { 
      console.error(`Error deleting media file: ${fileError.message}`);
      // Continue with DB deletion even if file deletion fails
    }

    // Clear relevant caches
    clearCache('media');

    // Delete from database
    await Media.findByIdAndDelete(id);

    console.log("Media deleted and related caches cleared");
    return res.status(204).end();
  } catch (error) {
    console.error("Error during media deletion:", error);
    return res.status(500).json({ error: "Failed to delete media" });
  }
}

// Error handler
function handleErrorResponse(error, res) {
  if (error.name === "CastError") {
    return res.status(400).json({ error: "Invalid ID format" });
  }
  if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }
  if (error.name === "MongoServerError" && error.code === 11000) {
    return res.status(409).json({ error: "Duplicate key error" });
  }
  return res.status(500).json({ 
    error: "Internal server error",
    ...(process.env.NODE_ENV === 'development' && { details: error.message })
  });
}