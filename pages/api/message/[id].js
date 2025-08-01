// pages/api/messages/[id].js
import dbConnect from "@/lib/dbConnect";
import Message from "@/models/Message";
import { setCache, getCache, clearCache } from "@/lib/cache";
import mongoose from "mongoose";

export default async function handler(req, res) {
  await dbConnect();

  const { query: { id }, method } = req;

  // Validate ID format before processing
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid message ID format" });
  }

  try {
    switch (method) {
      case "GET":
        return handleGetRequest(id, res);
      case "DELETE":
        return handleDeleteRequest(id, res);
      default:
        res.setHeader("Allow", ["GET", "DELETE"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error(`Error during ${method} request for message ${id}:`, error);
    return handleErrorResponse(error, res);
  }
}

// GET handler
async function handleGetRequest(id, res) {
  const cacheKey = `message-${id}`;
  const cachedMessage = getCache(cacheKey);
  if (cachedMessage) {
    console.log(`Returning cached message: ${id}`);
    return res.status(200).json(cachedMessage);
  }

  const message = await Message.findById(id);
  if (!message) {
    return res.status(404).json({ error: "Message not found" });
  }

  setCache(cacheKey, message);
  return res.status(200).json(message);
}

// DELETE handler
async function handleDeleteRequest(id, res) {
  try {
    // Clear relevant caches
    clearCache('message'); // Clear all messages list caches
    setCache(`message-${id}`, null);

    const deletedMessage = await Message.findByIdAndDelete(id);
    if (!deletedMessage) {
      return res.status(404).json({ error: "Message not found" });
    }

    console.log("Message deleted and related caches cleared");
    return res.status(204).end();
  } catch (error) {
    console.error("Error during message deletion:", error);
    return res.status(500).json({ error: "Failed to delete message" });
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
  return res.status(500).json({ error: "Internal server error" });
}