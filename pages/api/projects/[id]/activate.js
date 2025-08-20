// /pages/api/projects/[id]/activate.js
import dbConnect from "@/lib/dbConnect";
import Project from "@/models/Project";
import { setCache, clearCache } from "@/lib/cache";
import mongoose from "mongoose";

export default async function handler(req, res) {
  await dbConnect();

  const { query: { id }, method } = req;

  // Validate ID format before processing
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid project ID format" });
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
    console.error(`Error during ${method} request for project ${id}:`, error);
    return handleErrorResponse(error, res);
  }
}

// PATCH handler - Update project status to 'Active'
async function handlePatchRequest(id, req, res) {
  // Clear relevant caches
  clearCache('project'); // Clear all projects list caches
  setCache(`project-${id}`, null);

  const updatedProject = await Project.findByIdAndUpdate(
    id,
    {
      status: 'Active',
      updatedAt: new Date()
    },
    { new: true, runValidators: true }
  );

  if (!updatedProject) {
    return res.status(404).json({ error: "Project not found" });
  }

  console.log("Project status updated to Active:", updatedProject);
  return res.status(200).json(updatedProject);
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