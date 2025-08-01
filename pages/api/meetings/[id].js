// pages/api/meetings/[id].js
import dbConnect from "@/lib/dbConnect";
import Meeting from "@/models/Meeting";
import { setCache, getCache, clearCache } from "@/lib/cache";
import mongoose from "mongoose";

export default async function handler(req, res) {
  await dbConnect();

  const { query: { id }, method } = req;

  // Validate ID format before processing
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid meeting ID format" });
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
    console.error(`Error during ${method} request for meeting ${id}:`, error);
    return handleErrorResponse(error, res);
  }
}

// GET handler
async function handleGetRequest(id, res) {
  const cacheKey = `meeting-${id}`;
  const cachedMeeting = getCache(cacheKey);
  if (cachedMeeting) {
    console.log(`Returning cached meeting: ${id}`);
    return res.status(200).json(cachedMeeting);
  }

  const meeting = await Meeting.findById(id);
  if (!meeting) {
    return res.status(404).json({ error: "Meeting not found" });
  }

  setCache(cacheKey, meeting);
  return res.status(200).json(meeting);
}

// PUT handler
async function handlePutRequest(id, req, res) {
  const { body } = req;
  
  // Validate required fields
  if (!body.dateTime || !body.firstName || !body.lastName || !body.email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Clear relevant caches
  clearCache('meeting'); // Clear all meetings list caches
  setCache(`meeting-${id}`, null);

  const updatedMeeting = await Meeting.findByIdAndUpdate(
    id,
    {
      dateTime: body.dateTime,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone || null,
      notes: body.notes || null,
    },
    { new: true, runValidators: true }
  );

  if (!updatedMeeting) {
    return res.status(404).json({ error: "Meeting not found" });
  }

  console.log("Meeting updated:", updatedMeeting);
  return res.status(200).json(updatedMeeting);
}

// DELETE handler
async function handleDeleteRequest(id, res) {
  try {
    // Clear relevant caches
    clearCache('meeting'); // Clear all meetings list caches
    setCache(`meeting-${id}`, null);

    const deletedMeeting = await Meeting.findByIdAndDelete(id);
    if (!deletedMeeting) {
      return res.status(404).json({ error: "Meeting not found" });
    }

    console.log("Meeting deleted and related caches cleared");
    return res.status(204).end();
  } catch (error) {
    console.error("Error during meeting deletion:", error);
    return res.status(500).json({ error: "Failed to delete meeting" });
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
    return res.status(409).json({ error: "Duplicate meeting time - dateTime must be unique" });
  }
  return res.status(500).json({ error: "Internal server error" });
}