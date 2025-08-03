// pages/api/posts/[id]/comments.ts
import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";
import { setCache, getCache, clearCache } from "@/lib/cache";
import mongoose from "mongoose";

export default async function handler(req, res) {
  await dbConnect();

  const { query: { id }, method } = req;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid post ID format" });
  }

  try {
    switch (method) {
      case "GET":
        return handleGetComments(id, res);
      case "POST":
        return handleAddComment(id, req, res);
      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error(`Error during ${method} request for post comments ${id}:`, error);
    return handleErrorResponse(error, res);
  }
}

async function handleGetComments(id, res) {
  const cacheKey = `post-comments-${id}`;
  const cachedComments = getCache(cacheKey);
  if (cachedComments) {
    console.log(`Returning cached comments for post: ${id}`);
    return res.status(200).json(cachedComments);
  }

  const post = await Post.findById(id).select('comments');
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  setCache(cacheKey, post.comments);
  return res.status(200).json(post.comments);
}

async function handleAddComment(id, req, res) {
  const { name, text } = req.body;
  
  if (!name || !text) {
    return res.status(400).json({ error: "Name and text are required" });
  }

  const newComment = {
    name,
    text,
    date: new Date().toLocaleDateString('en-US'),
    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  };

  clearCache(`post-comments-${id}`);
  clearCache(`post-${id}`);

  const updatedPost = await Post.findByIdAndUpdate(
    id,
    { $push: { comments: newComment } },
    { new: true }
  );

  if (!updatedPost) {
    return res.status(404).json({ error: "Post not found" });
  }

  console.log("Comment added to post:", id);
  return res.status(201).json(newComment);
}

function handleErrorResponse(error, res) {
  if (error.name === "CastError") {
    return res.status(400).json({ error: "Invalid ID format" });
  }
  if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }
  return res.status(500).json({ error: "Internal server error" });
}