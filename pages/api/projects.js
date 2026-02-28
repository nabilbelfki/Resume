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
    sortOrder = 'desc',
    status = ''
  } = query;

  const pageNumber = parseInt(page.toString());
  let limitNumber = parseInt(limit.toString());
  const skip = (pageNumber - 1) * limitNumber;

  const sortDirection = sortOrder.toString().toLowerCase() === 'asc' ? 1 : -1;

  const cacheKey = `projects:${page}:${limit}:${search}:${sortBy}:${sortOrder}:${status}`;

  const cachedData = getCache(cacheKey);
  if (cachedData) {
    console.log(`Returning cached projects data for key: ${cacheKey}`);
    return res.status(200).json(cachedData);
  }

  const conditions = {};
  // Add status filter condition if provided
  if (status) {
    const statusValue = status.toString().toLowerCase();
    if (statusValue === 'active') {
      conditions.status = { $ne: 'Inactive' };
    } else if (statusValue === 'inactive') {
      conditions.status = 'Inactive';
    }
    // If status is provided but not valid, it will be ignored
  }

  if (search) {
    const searchRegex = new RegExp(search.toString(), 'i');
    conditions.$or = [
      { name: searchRegex },
      { url: searchRegex },
    ];
  }

  const total = await Project.countDocuments(conditions);
  let data;

  if (sortBy === 'duration') {
    console.log("Using aggregation pipeline to sort by duration...");
    const pipeline = [
      // Filter by search and status conditions
      { $match: conditions },
      // Project a new field 'durationInDays' for sorting
      {
        $addFields: {
          durationInDays: {
            $let: {
              vars: {
                parts: { $split: ["$duration", " "] }
              },
              in: {
                $switch: {
                  branches: [
                    {
                      case: { $or: [{ $eq: [{ $arrayElemAt: ["$$parts", 1] }, "Day"] }, { $eq: [{ $arrayElemAt: ["$$parts", 1] }, "Days"] }] },
                      then: { $toInt: { $arrayElemAt: ["$$parts", 0] } }
                    },
                    {
                      case: { $or: [{ $eq: [{ $arrayElemAt: ["$$parts", 1] }, "Week"] }, { $eq: [{ $arrayElemAt: ["$$parts", 1] }, "Weeks"] }] },
                      then: { $multiply: [{ $toInt: { $arrayElemAt: ["$$parts", 0] } }, 7] }
                    },
                    {
                      case: { $or: [{ $eq: [{ $arrayElemAt: ["$$parts", 1] }, "Month"] }, { $eq: [{ $arrayElemAt: ["$$parts", 1] }, "Months"] }] },
                      then: { $multiply: [{ $toInt: { $arrayElemAt: ["$$parts", 0] } }, 30] } // Approximate months as 30 days
                    },
                    {
                      case: { $or: [{ $eq: [{ $arrayElemAt: ["$$parts", 1] }, "Year"] }, { $eq: [{ $arrayElemAt: ["$$parts", 1] }, "Years"] }] },
                      then: { $multiply: [{ $toInt: { $arrayElemAt: ["$$parts", 0] } }, 365] } // Approximate years as 365 days
                    }
                  ],
                  default: 0 // Default to 0 if duration format is unexpected
                }
              }
            }
          }
        }
      },
      // Sort by the new 'durationInDays' field and then by _id as a tie-breaker
      {
        $sort: {
          durationInDays: sortDirection,
          _id: sortDirection
        }
      },
      // Pagination stages
      { $skip: skip },
      { $limit: limitNumber > 0 ? limitNumber : total }
    ];

    data = await Project.aggregate(pipeline);
  } else {
    const sortOptions = {
      [sortBy]: sortDirection,
      '_id': sortDirection
    };

    let queryBuilder = Project.find(conditions)
      .sort(sortOptions);
    if (limitNumber > 0) {
      queryBuilder = queryBuilder.skip(skip).limit(limitNumber);
    } else {
      limitNumber = total;
    }

    data = await queryBuilder;
  }

  console.log(`Projects fetched: ${data.length} of ${total} total, sorted by ${sortBy} ${sortOrder}`);
  if (status) {
    console.log(`Filtered by status: ${status}`);
  }

  const responseData = {
    data,
    total,
    totalPages: (limitNumber > 0 && total > 0) ? Math.ceil(total / limitNumber) : 1,
    currentPage: pageNumber,
    limit: limitNumber,
    sortBy,
    sortOrder,
    // Add status filter info to response
    ...(status && { filteredByStatus: status })
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
      status: body.status,
      duration: body.duration,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      views: body.views,
      repository: body.repository,
      thumbnail: body.thumbnail,
      description: body.description,
      slug: body.slug,
      url: body.url,
      languages: body.languages,
      tools: body.tools,
      container: body.container,
      client: body.client,
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