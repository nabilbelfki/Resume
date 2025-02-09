// /pages/api/projects/[id].js
import dbConnect from "../../../lib/dbConnect";
import Project from "../../../models/Project";

export default async function handler(req, res) {
  const { id } = req.query;
  await dbConnect();

  try {
    console.log("Connected to MongoDB");
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    console.log("Project:", project);
    res.status(200).json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ error: "Failed to fetch project" });
  }
}
