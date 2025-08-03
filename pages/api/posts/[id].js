// pages/api/posts/[id].ts
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
    console.error(`Error during ${method} request for post ${id}:`, error);
    return handleErrorResponse(error, res);
  }
}

async function handleGetRequest(id, res) {
  const cacheKey = `post-${id}`;
  const cachedPost = getCache(cacheKey);
  if (cachedPost) {
    console.log(`Returning cached post: ${id}`);
    return res.status(200).json(cachedPost);
  }

  const post = await Post.findById(id);
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  setCache(cacheKey, post);
  return res.status(200).json(post);
}

async function handlePutRequest(id, req, res) {
  const { body } = req;
  
  if (!body.title || !body.author || !body.content || !body.slug) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Clear relevant caches
  clearCache('posts'); // Clear all posts list caches
  setCache(`post-${id}`, null);

  const updatedPost = await Post.findByIdAndUpdate(
    id,
    {
      title: body.title,
      author: body.author,
      date: body.date,
      readTime: body.readTime,
      category: body.category,
      status: body.status,
      content: body.content,
      featuredImage: body.featuredImage,
      slug: body.slug,
      tags: body.tags,
      updatedAt: new Date()
    },
    { new: true, runValidators: true }
  );

  if (!updatedPost) {
    return res.status(404).json({ error: "Post not found" });
  }

  console.log("Post updated:", updatedPost);
  return res.status(200).json(updatedPost);
}

async function handleDeleteRequest(id, res) {
  try {
    clearCache('posts');
    setCache(`post-${id}`, null);

    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    console.log("Post deleted and related caches cleared");
    return res.status(204).end();
  } catch (error) {
    console.error("Error during post deletion:", error);
    return res.status(500).json({ error: "Failed to delete post" });
  }
}

function handleErrorResponse(error, res) {
  if (error.name === "CastError") {
    return res.status(400).json({ error: "Invalid ID format" });
  }
  if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }
  if (error.name === "MongoServerError" && error.code === 11000) {
    return res.status(409).json({ error: "Slug must be unique" });
  }
  return res.status(500).json({ error: "Internal server error" });
}