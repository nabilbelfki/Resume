// pages/api/posts/[id]/comments/[commentId].ts
import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";
import { clearCache } from "@/lib/cache";
import mongoose from "mongoose";

export default async function handler(req, res) {
  await dbConnect();

  const { query: { id, commentId }, method } = req;

  // Validate both IDs
  if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(commentId)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  if (method === "DELETE") {
    try {
      const updatedPost = await Post.findByIdAndUpdate(
        id,
        { $pull: { comments: { _id: commentId } } },
        { new: true }
      );

      if (!updatedPost) {
        return res.status(404).json({ error: "Post not found" });
      }
      
      clearCache(`post`);

      return res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
      console.error("Error deleting comment:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }
}