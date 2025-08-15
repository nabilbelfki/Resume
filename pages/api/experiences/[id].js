// pages/api/experiences/[id].js
import dbConnect from "@/lib/dbConnect";
import Experience from "@/models/Experience";
import { setCache, getCache, clearCache } from "@/lib/cache";
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
    console.error(`Error during ${method} request for experience ${id}:`, error);
    return handleErrorResponse(error, res);
  }
}

// GET handler - Get single experience by ID
async function handleGetRequest(id, res) {
  const cacheKey = `experience-${id}`;
  const cachedExperience = getCache(cacheKey);
  if (cachedExperience) {
    console.log(`Returning cached experience: ${id}`);
    return res.status(200).json(cachedExperience);
  }

  const experience = await Experience.findById(id);
  if (!experience) {
    return res.status(404).json({ error: "Experience not found" });
  }

  setCache(cacheKey, experience);
  return res.status(200).json(experience);
}

// PUT handler - Update an experience
async function handlePutRequest(id, req, res) {
  const { body } = req;

  // Clear relevant caches
  clearCache('experience'); // Clear all experiences list caches
  setCache(`experience-${id}`, null);

  const updatedExperience = await Experience.findByIdAndUpdate(
    id,
    {
      level: body.level || 0,
      zIndex: body.zIndex || 0,
      name: body.name,
      location: body.location,
      type: body.type,
      logo: {
        opened: {
          name: body.logo?.opened?.name || '',
          path: body.logo?.opened?.path || '',
          width: body.logo?.opened?.width || 0,
          height: body.logo?.opened?.height || 0,
        },
        closed: {
          name: body.logo?.closed?.name || '',
          path: body.logo?.closed?.path || '',
          width: body.logo?.closed?.width || 0,
          height: body.logo?.closed?.height || 0,
        }
      },
      title: body.title,
      subtitle: body.subtitle,
      period: {
        title: body.period?.title || '',
        start: new Date(body.period.start),
        ...(body.period?.end && { end: new Date(body.period.end) }),
      },
      color: {
        line: body.color?.line || '',
        name: body.color?.name || '',
        title: body.color?.title || '',
        subtitle: body.color?.subtitle || '',
        type: body.color?.type || '',
        date: body.color?.date || '',
        location: body.color?.location || '',
        background: body.color?.background || '',
        details: body.color?.details || '',
        description: {
          text: body.color?.description?.text || '',
          background: body.color?.description?.background || '',
        }
      },
      description: body.description
    },
    { new: true, runValidators: true }
  );

  if (!updatedExperience) {
    return res.status(404).json({ error: "Experience not found" });
  }

  console.log("Experience updated:", updatedExperience);
  return res.status(200).json(updatedExperience);
}

// DELETE handler - Delete an experience
async function handleDeleteRequest(id, res) {
  try {
    // Clear relevant caches
    clearCache('experiences'); // Clear all experiences list caches
    setCache(`experience-${id}`, null);

    const deletedExperience = await Experience.findByIdAndDelete(id);
    if (!deletedExperience) {
      return res.status(404).json({ error: "Experience not found" });
    }

    console.log("Experience deleted and related caches cleared");
    return res.status(204).end();
  } catch (error) {
    console.error("Error during experience deletion:", error);
    return res.status(500).json({ error: "Failed to delete experience" });
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