// /pages/api/experiences.js
import dbConnect from "../../lib/dbConnect";
import Experience from "../../models/Experience";
import { setCache, getCache } from "../../lib/cache";

export default async function handler(req, res) {
  await dbConnect();

  try {
    console.log("Connected to MongoDB");

    // Check if the experiences data is cached
    const cachedExperiences = getCache("experiences");
    if (cachedExperiences) {
      console.log("Returning cached experiences");
      return res.status(200).json(cachedExperiences);
    }

    // If not cached, fetch the experiences from the database
    const experiences = await Experience.find({});
    console.log("Experiences:", experiences);

    // Cache the experiences data
    setCache("experiences", experiences);

    res.status(200).json(experiences);
  } catch (error) {
    console.error("Error fetching experiences:", error);
    res.status(500).json({ error: "Failed to fetch experiences" });
  }
}
