// /pages/api/projects/[id].js
import dbConnect from "../../../lib/dbConnect";
import Project from "../../../models/Project";
import { setCache, getCache } from "../../../lib/cache";

export default async function handler(req, res) {
  const { id } = req.query;
  await dbConnect();

  try {
    console.log("Connected to MongoDB");

    // Check if the project data is cached
    const cachedProject = getCache(`project_${id}`);
    if (cachedProject) {
      console.log("Returning cached project");
      return res.status(200).json(cachedProject);
    }

    // If not cached, fetch the project from the database
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    console.log("Project:", project);

    // Cache the project data
    setCache(`project_${id}`, project);

    res.status(200).json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ error: "Failed to fetch project" });
  }
}
