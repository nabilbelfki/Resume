// /pages/api/skills.js
import dbConnect from "../../lib/dbConnect";
import Skill from "../../models/Skill";

export default async function handler(req, res) {
  await dbConnect();

  try {
    console.log("Connected to MongoDB");
    const skills = await Skill.find({});
    console.log("Skills:", skills);
    res.status(200).json(skills);
  } catch (error) {
    console.error("Error fetching skills:", error);
    res.status(500).json({ error: "Failed to fetch skills" });
  }
}
