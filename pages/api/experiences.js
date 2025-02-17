// /pages/api/experiences.js
import dbConnect from "../../lib/dbConnect";
import Experience from "../../models/Experience";

export default async function handler(req, res) {
  await dbConnect();

  try {
    console.log("Connected to MongoDB");
    const experiences = await Experience.find({});
    console.log("Experiences:", experiences);
    res.status(200).json(experiences);
  } catch (error) {
    console.error("Error fetching experiences:", error);
    res.status(500).json({ error: "Failed to fetch experiences" });
  }
}
