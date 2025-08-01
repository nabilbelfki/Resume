// pages/api/skills/[id].js
import dbConnect from "@/lib/dbConnect";
import Skill from "@/models/Skill";
import { setCache, getCache, clearCache } from "@/lib/cache";
import mongoose from "mongoose";

export default async function handler(req, res) {
  await dbConnect();

  const { query: { id }, method } = req;

  // Validate ID format before processing
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid skill ID format" });
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
    console.error(`Error during ${method} request for skill ${id}:`, error);
    return handleErrorResponse(error, res);
  }
}

// GET handler
async function handleGetRequest(id, res) {
  const cacheKey = `skill-${id}`;
  const cachedSkill = getCache(cacheKey);
  if (cachedSkill) {
    console.log(`Returning cached skill: ${id}`);
    return res.status(200).json(cachedSkill);
  }

  const skill = await Skill.findById(id);
  if (!skill) {
    return res.status(404).json({ error: "Skill not found" });
  }

  setCache(cacheKey, skill);
  return res.status(200).json(skill);
}

// PUT handler
async function handlePutRequest(id, req, res) {
  const { body } = req;
  
  // Validate required fields
  if (!body.type || !body.name || !body.image || !body.description) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Clear relevant caches
  clearCache('skill'); // Clear all skills list caches
  setCache(`skill-${id}`, null);

  const updatedSkill = await Skill.findByIdAndUpdate(
    id,
    {
      type: body.type,
      name: body.name,
      status: body.status,
      image: {
        name: body.image.name,
        url: body.image.url,
        backgroundColor: body.image.backgroundColor,
        height: body.image.height,
        width: body.image.width,
      },
      description: {
        color: body.description.color,
        text: body.description.text,
        backgroundColor: body.description.backgroundColor,
      }
    },
    { new: true, runValidators: true }
  );

  if (!updatedSkill) {
    return res.status(404).json({ error: "Skill not found" });
  }

  console.log("Skill updated:", updatedSkill);
  return res.status(200).json(updatedSkill);
}

// DELETE handler
async function handleDeleteRequest(id, res) {
  try {
    // Clear relevant caches
    clearCache('skill'); // Clear all skills list caches
    setCache(`skill-${id}`, null);

    const deletedSkill = await Skill.findByIdAndDelete(id);
    if (!deletedSkill) {
      return res.status(404).json({ error: "Skill not found" });
    }

    console.log("Skill deleted and related caches cleared");
    return res.status(204).end();
  } catch (error) {
    console.error("Error during skill deletion:", error);
    return res.status(500).json({ error: "Failed to delete skill" });
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