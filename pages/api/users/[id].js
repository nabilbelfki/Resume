// pages/api/users/[id].js
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { setCache, getCache, clearCache } from "@/lib/cache";
import mongoose from "mongoose";

export default async function handler(req, res) {
  await dbConnect();

  const { query: { id }, method } = req;

  // Validate ID format before processing
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid user ID format" });
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
    console.error(`Error during ${method} request for user ${id}:`, error);
    return handleErrorResponse(error, res);
  }
}

// GET handler
async function handleGetRequest(id, res) {
  const cachedUser = getCache(`user-${id}`);
  if (cachedUser) {
    console.log(`Returning cached user: ${id}`);
    return res.status(200).json(cachedUser);
  }

  const user = await User.findById(id).select('-password -__v'); // Exclude sensitive fields
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  setCache(`user-${id}`, user);
  return res.status(200).json(user);
}

// PUT handler
async function handlePutRequest(id, req, res) {
  const { body } = req;
  
  // Validate required fields
  if (!body.username || !body.email) {
    return res.status(400).json({ error: "Username and email are required" });
  }

  // Clear relevant caches
  setCache("users", null);
  setCache(`user-${id}`, null);

  const updatedUser = await User.findByIdAndUpdate(
    id,
    {
      ...body,
      // Convert birthday string to Date if provided
      birthday: body.birthday ? new Date(body.birthday) : undefined,
      // Handle address updates
      address: body.address || undefined
    },
    { new: true, runValidators: true }
  ).select('-password -__v');

  if (!updatedUser) {
    return res.status(404).json({ error: "User not found" });
  }

  console.log("User updated:", updatedUser);
  return res.status(200).json(updatedUser);
}

// DELETE handler
async function handleDeleteRequest(id, res) {
  try {
    clearCache('user');

    // Delete the user from database
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("User deleted and related caches cleared");
    return res.status(204).end();
  } catch (error) {
    console.error("Error during user deletion:", error);
    return res.status(500).json({ error: "Failed to delete user" });
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
  return res.status(500).json({ error: "Internal server error" });
}