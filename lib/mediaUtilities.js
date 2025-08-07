import fs from 'fs/promises';
import path from 'path';
import { IncomingForm } from 'formidable';
import Media from "../models/Media";
import { clearCache, setCache } from "./cache";

export async function handleFileUpload(req, existingMedia = null) {
  const form = new IncomingForm({
    keepExtensions: true,
    maxFileSize: 50 * 1024 * 1024,
    multiples: false,
    uploadDir: process.env.TMP_DIR || '/tmp',
    filter: (part) => {
      return (
        part.name === 'file' && 
        (part.mimetype?.includes('image/') || 
         part.mimetype?.includes('video/') || 
         part.mimetype?.includes('audio/'))
      );
    }
  });

  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });

  if (!files?.file) {
    throw new Error("No file uploaded or invalid file type");
  }

  const file = Array.isArray(files.file) ? files.file[0] : files.file;

  if (!file.filepath || !(await fileExists(file.filepath))) {
    throw new Error("Invalid file path");
  }

  // Determine file type from mimetype
  const fileType = determineFileType(file.mimetype);
  const originalFilename = file.originalFilename || path.basename(file.filepath);
  const ext = path.extname(originalFilename).toLowerCase();
  const baseName = path.basename(originalFilename, ext);

  // Create upload directory
  const typeDir = `${fileType}s`;
  const uploadDir = path.join(process.cwd(), 'public', typeDir);
  await fs.mkdir(uploadDir, { recursive: true });

  // Generate safe filename
  const safeName = baseName.replace(/[^a-zA-Z0-9-_]/g, '_');
  const fileName = `${safeName}${ext}`;
  let newPath = path.join(uploadDir, fileName);
  
  // Handle duplicates
  let counter = 1;
  while (await fileExists(newPath)) {
    newPath = path.join(uploadDir, `${safeName}_${counter}${ext}`);
    counter++;
  }

  await moveFile(file.filepath, newPath);
  const relativePath = `/${typeDir}/${path.basename(newPath)}`;

  // Get dimensions for images
  let dimensions = { width: null, height: null };
  if (fileType === 'image' && !['.svg'].includes(ext)) {
    try {
      const imageBuffer = await fs.readFile(newPath);
      const sizeOf = await import('image-size');
      dimensions = sizeOf.default(imageBuffer);
    } catch (err) {
      console.error('Could not get image dimensions:', err);
    }
  }

  // Delete old file if updating existing media
  if (existingMedia?.path) {
    try {
      const oldPath = path.join(process.cwd(), 'public', existingMedia.path);
      if (await fileExists(oldPath)) {
        await fs.unlink(oldPath);
      }
    } catch (err) {
      console.error('Error deleting old file:', err);
    }
  }

  return {
    fileName: path.basename(newPath),
    path: relativePath,
    url: `${process.env.NEXT_PUBLIC_BASE_URL || ''}${relativePath}`,
    fileSize: file.size,
    description: getFieldValue(fields.description) || '',
    fileType: fileType.charAt(0).toUpperCase() + fileType.slice(1), // Capitalize first letter
    extension: ext.replace('.', ''),
    dimensions,
    backgroundColor: getFieldValue(fields.backgroundColor) || '#ffffff',
    metadata: {
      directory: fileType,
      ...(fields.metadata && JSON.parse(getFieldValue(fields.metadata)))
    }
  };
}

export async function saveMediaToDatabase(data, id = null) {
  clearCache('media');
  if (id) setCache(`media-${id}`, null);

  const mediaData = {
    fileName: data.fileName,
    path: data.path,
    url: data.url,
    fileSize: data.fileSize,
    description: data.description,
    fileType: data.fileType,
    extension: data.extension,
    dimensions: data.dimensions,
    backgroundColor: data.backgroundColor,
    metadata: data.metadata,
    lastModified: new Date()
  };

  if (id) {
    return await Media.findByIdAndUpdate(id, mediaData, { new: true, runValidators: true });
  } else {
    mediaData.created = new Date();
    return await Media.create(mediaData);
  }
}

// Helper functions
function determineFileType(mimetype) {
  if (mimetype?.includes('video/')) return 'video';
  if (mimetype?.includes('audio/')) return 'sound';
  return 'image';
}

async function fileExists(path) {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

async function moveFile(src, dest) {
  try {
    await fs.rename(src, dest);
  } catch (err) {
    await fs.copyFile(src, dest);
    await fs.unlink(src);
  }
}

function getFieldValue(field) {
  return Array.isArray(field) ? field[0] : field;
}