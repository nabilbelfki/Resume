// /pages/api/projects.js
import dbConnect from "../../lib/dbConnect";
import Project from "../../models/Project";
import { setCache, getCache, clearCache } from "../../lib/cache";

export default async function handler(req, res) {
  await dbConnect();

  const { method, query } = req;

  try {
    console.log("Connected to MongoDB for Projects API");

    switch (method) {
      case "GET":
        return handleGetRequest(query, res);
      case "POST":
        return handlePostRequest(req, res);
      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error(`Error during ${method} request for projects:`, error);
    return handleErrorResponse(error, res);
  }
}

// GET handler with pagination, search, and sorting
async function handleGetRequest(query, res) {
  console.log("Processing GET request for Projects");

  const {
    page = 1,
    limit = 0,
    search = '',
    sortBy = 'startDate',
    sortOrder = 'desc'
  } = query;

  const pageNumber = parseInt(page.toString());
  let limitNumber = parseInt(limit.toString());
  const skip = (pageNumber - 1) * limitNumber;

  const sortDirection = sortOrder.toString().toLowerCase() === 'asc' ? 1 : -1;

  const cacheKey = `projects:${page}:${limit}:${search}:${sortBy}:${sortOrder}`;

  const cachedData = getCache(cacheKey);
  if (cachedData) {
    console.log(`Returning cached projects data for key: ${cacheKey}`);
    return res.status(200).json(cachedData);
  }

  const conditions = {};
  if (search) {
    const searchRegex = new RegExp(search.toString(), 'i');
    conditions.$or = [
      { name: searchRegex },
      { description: searchRegex },
      { 'client.title.name': searchRegex }
    ];
  }

  const total = await Project.countDocuments(conditions);
  const sortOptions = {};
  sortOptions[sortBy.toString()] = sortDirection;

  let queryBuilder = Project.find(conditions)
    .sort(sortOptions);
  if (limitNumber > 0) {
    queryBuilder = queryBuilder.skip(skip).limit(limitNumber);
  } else {
    limitNumber = total;
  }

  const data = await queryBuilder;

  console.log(`Projects fetched: ${data.length} of ${total} total, sorted by ${sortBy} ${sortOrder}`);

  const responseData = {
    data,
    total,
    totalPages: (limitNumber > 0 && total > 0) ? Math.ceil(total / limitNumber) : 1,
    currentPage: pageNumber,
    limit: limitNumber,
    sortBy,
    sortOrder
  };

  // Cache the prepared response data
  setCache(cacheKey, responseData);

  return res.status(200).json(responseData);
}

// POST handler - Create new project
async function handlePostRequest(req, res) {
  const { body } = req;
  
  // Validate required fields
  if (!body.name || !body.duration || !body.startDate || !body.endDate || 
      !body.views || !body.repository || !body.description || !body.slug || !body.client) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const newProject = new Project({
      name: body.name,
      duration: body.duration,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      views: body.views,
      repository: {
        type: body.repository.type,
        url: body.repository.url,
        shortUrl: body.repository.shortUrl
      },
      container: body.container ? {
        type: body.container.type || '',
        url: body.container.url || '',
        shortUrl: body.container.shortUrl || ''
      } : undefined,
      tools: body.tools ? {
        name: body.tools.name || '',
        slug: body.tools.slug || '',
        url: body.tools.url || '',
        color: body.tools.color || '',
        imagePath: body.tools.imagePath || ''
      } : undefined,
      description: body.description,
      slug: body.slug,
      client: {
        title: {
          name: body.client.title.name,
          fontSize: body.client.title.fontSize
        },
        logo: {
          width: body.client.logo.width,
          height: body.client.logo.height,
          path: body.client.logo.path,
          fileName: body.client.logo.fileName
        },
        location: {
          latitude: body.client.location.latitude,
          longitude: body.client.location.longitude
        },
        description: body.client.description,
        slides: body.client.slides?.map(slide => ({
          name: slide.name,
          image: {
            width: slide.image.width,
            height: slide.image.height,
            src: slide.image.src,
            alt: slide.image.alt
          }
        })) || []
      },
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Clear projects cache
    clearCache('projects');

    const savedProject = await newProject.save();
    console.log("Project created successfully:", savedProject);
    return res.status(201).json(savedProject);
  } catch (error) {
    console.error("Error creating project:", error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: "Failed to create project" });
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