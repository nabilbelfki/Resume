// /pages/api/projects.js
import dbConnect from "../../lib/dbConnect";
import Project from "../../models/Project";

export default async function handler(req, res) {
  await dbConnect();

  try {
    console.log("Connected to MongoDB");
    const projects = await Project.find({});
    console.log("Projects:", projects);
    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
}
