// /pages/api/posts/[id]/archive.js
import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";
import { setCache, clearCache } from "@/lib/cache";
import mongoose from "mongoose";

export default async function handler(req, res) {
  await dbConnect();

  const { query: { id }, method } = req;

  // Validate ID format before processing
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid post ID format" });
  }

  try {
    switch (method) {
      case "PATCH":
        return handlePatchRequest(id, req, res);
      default:
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error(`Error during ${method} request for post ${id}:`, error);
    return handleErrorResponse(error, res);
  }
}

// PATCH handler - Update post status to 'Archived'
async function handlePatchRequest(id, req, res) {
  // Clear relevant caches
  clearCache('post'); // Clear all posts list caches
  setCache(`post-${id}`, null);

  const updatedPost = await Post.findByIdAndUpdate(
    id,
    {
      status: 'Archived',
      updatedAt: new Date()
    },
    { new: true, runValidators: true }
  );

  if (!updatedPost) {
    return res.status(404).json({ error: "Post not found" });
  }

  console.log("Post status updated to Archived:", updatedPost);
  return res.status(200).json(updatedPost);
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
  return res.status(500).json({ error: "Internal server error" });
}