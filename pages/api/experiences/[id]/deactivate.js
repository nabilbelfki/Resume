// /pages/api/experiences/[id]/deactivate.js
import dbConnect from "@/lib/dbConnect";
import Experience from "@/models/Experience";
import { setCache, clearCache } from "@/lib/cache";
import mongoose from "mongoose";

export default async function handler(req, res) {
  await dbConnect();

  const { query: { id }, method } = req;

  // Validate ID format before processing
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid experience ID format" });
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
    console.error(`Error during ${method} request for experience ${id}:`, error);
    return handleErrorResponse(error, res);
  }
}

// PATCH handler - Update experience status to 'Active'
async function handlePatchRequest(id, req, res) {
  // Clear relevant caches
  clearCache('experience');
  setCache(`experience-${id}`, null);

  const updatedExperience = await Experience.findByIdAndUpdate(
    id,
    {
      status: 'Inactive',
      updatedAt: new Date()
    },
    { new: true, runValidators: true }
  );

  if (!updatedExperience) {
    return res.status(404).json({ error: "Experience not found" });
  }

  console.log("Experience status updated to Inactive:", updatedExperience);
  return res.status(200).json(updatedExperience);
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