import dbConnect from "../../lib/dbConnect";
import Project from "../../models/Project";
import { setCache, getCache } from "../../lib/cache";

export default async function handler(req, res) {
  await dbConnect();

  try {
    console.log("Connected to MongoDB");

    // Check if the projects data is cached
    const cachedProjects = getCache("projects");
    if (cachedProjects) {
      console.log("Returning cached projects");
      return res.status(200).json(cachedProjects);
    }

    // If not cached, fetch the projects from the database
    const projects = await Project.find({});
    console.log("Projects:", projects);

    // Cache the projects data
    setCache("projects", projects);

    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
}
