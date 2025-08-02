// /pages/api/projects/[id].js
import dbConnect from "../../../lib/dbConnect";
import Project from "../../../models/Project";
import { setCache, getCache, clearCache } from "../../../lib/cache";
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
    console.error(`Error during ${method} request for project ${id}:`, error);
    return handleErrorResponse(error, res);
  }
}

// GET handler - Get single project by ID
async function handleGetRequest(id, res) {
  const cacheKey = `project-${id}`;
  const cachedProject = getCache(cacheKey);
  if (cachedProject) {
    console.log(`Returning cached project: ${id}`);
    return res.status(200).json(cachedProject);
  }

  const project = await Project.findById(id);
  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }

  setCache(cacheKey, project);
  return res.status(200).json(project);
}

// PUT handler - Update a project
async function handlePutRequest(id, req, res) {
  const { body } = req;
  
  // Validate required fields
  if (!body.name || !body.duration || !body.startDate || !body.endDate || 
      !body.views || !body.repository || !body.description || !body.slug || !body.client) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Clear relevant caches
  clearCache('project'); // Clear all projects list caches
  setCache(`project-${id}`, null);

  const updateData = {
    name: body.name,
    duration: body.duration,
    startDate: new Date(body.startDate),
    endDate: new Date(body.endDate),
    views: body.views,
    repository: body.repository,
    thumbnail: body.thumbnail,
    description: body.description,
    slug: body.slug,
    url: body.url,
    languages: body.languages,
    tools: body.tools,
    container: body.container,
    client: body.client,
    updatedAt: new Date()
  };

  // Remove undefined fields
  Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

  const updatedProject = await Project.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );

  if (!updatedProject) {
    return res.status(404).json({ error: "Project not found" });
  }

  console.log("Project updated:", updatedProject);
  return res.status(200).json(updatedProject);
}

// DELETE handler - Delete a project
async function handleDeleteRequest(id, res) {
  try {
    // Clear relevant caches
    clearCache('projects'); // Clear all projects list caches
    setCache(`project-${id}`, null);

    const deletedProject = await Project.findByIdAndDelete(id);
    if (!deletedProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    console.log("Project deleted and related caches cleared");
    return res.status(204).end();
  } catch (error) {
    console.error("Error during project deletion:", error);
    return res.status(500).json({ error: "Failed to delete project" });
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