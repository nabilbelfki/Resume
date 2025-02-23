// /pages/api/skills.js
import dbConnect from "../../lib/dbConnect";
import Skill from "../../models/Skill";
import { setCache, getCache } from "../../lib/cache";

export default async function handler(req, res) {
  await dbConnect();

  try {
    console.log("Connected to MongoDB");

    // Check if the skills data is cached
    const cachedSkills = getCache("skills");
    if (cachedSkills) {
      console.log("Returning cached skills");
      return res.status(200).json(cachedSkills);
    }

    // If not cached, fetch the skills from the database
    const skills = await Skill.find({});
    console.log("Skills:", skills);

    // Cache the skills data
    setCache("skills", skills);

    res.status(200).json(skills);
  } catch (error) {
    console.error("Error fetching skills:", error);
    res.status(500).json({ error: "Failed to fetch skills" });
  }
}
