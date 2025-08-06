// /pages/api/skills.js
import dbConnect from "../../lib/dbConnect";
import Skill from "../../models/Skill";
import { setCache, getCache, clearCache } from "../../lib/cache"; // Added clearCache for cache invalidation

export default async function handler(req, res) {
  await dbConnect();

  const { method, query } = req; 

  try {
    console.log("Connected to MongoDB for Skills API");

    switch (method) {
      case "GET":
      console.log("Processing GET request for Skills");

      const {
        page = 1, 
        limit = 0,
        search = '', 
        sortBy = 'name',
        sortOrder = 'asc'
      } = query;

      const pageNumber = parseInt(page.toString());
      const limitNumber = parseInt(limit.toString());
      
      const sortDirection = sortOrder.toString().toLowerCase() === 'asc' ? 1 : -1;

      // Build search conditions
      const conditions = {};
      if (search) {
        const searchRegex = new RegExp(search.toString(), 'i');
        conditions.$or = [
          { name: searchRegex },
          { type: searchRegex }
        ];
      }

      // Get total count for pagination calculations
      const total = await Skill.countDocuments(conditions);

      // Handle pagination logic
      let queryBuilder = Skill.find(conditions);
      let actualLimit = limitNumber;
      let actualPage = pageNumber;
      let skip = 0;

      if (limitNumber > 0) {
        // Standard pagination
        skip = (pageNumber - 1) * limitNumber;
        queryBuilder = queryBuilder.skip(skip).limit(limitNumber);
      } else {
        // No limit - return all results
        actualLimit = total;
        actualPage = 1; // Reset to page 1 when showing all
        skip = 0;
      }

      // Apply sorting
      const sortOptions = {
        [sortBy]: sortDirection,
        '_id': sortDirection  // Always add _id as tiebreaker
      };
      queryBuilder = queryBuilder.sort(sortOptions);

      // Build cache key
      const cacheKey = `skills:${actualPage}:${actualLimit}:${search}:${sortBy}:${sortOrder}`;

      // Check cache
      const cachedData = getCache(cacheKey);
      if (cachedData) {
        console.log(`Returning cached skills data for key: ${cacheKey}`);
        return res.status(200).json(cachedData);
      }

      // Execute query
      const data = await queryBuilder;

      console.log(`Skills fetched: ${data.length} of ${total} total, page ${actualPage}, limit ${actualLimit}, skip ${skip}`);
      console.log(`Sorted by ${sortBy} ${sortOrder}`);

      // Calculate pagination info
      const totalPages = actualLimit > 0 ? Math.ceil(total / actualLimit) : 1;

      const responseData = {
        data,
        total,
        totalPages,
        currentPage: actualPage,
        limit: actualLimit,
        sortBy,
        sortOrder,
        // Add debug info in development
        ...(process.env.NODE_ENV === 'development' && {
          debug: {
            skip,
            originalLimit: limitNumber,
            searchConditions: conditions
          }
        })
      };

      // Cache the response
      setCache(cacheKey, responseData);

      res.status(200).json(responseData);
      break;

      case "POST":
        try {
          console.log("Processing POST request for Skills");
          const { type, status, name, image, description } = req.body;

          // Basic validation
          if (!type || !name || !image || !description) {
            return res.status(400).json({ error: "Missing required fields" });
          }

          // Create new skill document
          const newSkill = new Skill({
            type,
            name,
            image: {
              name: image.name || '',
              url: image.url || '',
              backgroundColor: image.backgroundColor || '',
              height: image.height || 0,
              width: image.width || 0,
            },
            status,
            description: {
              color: description.color || '',
              text: description.text || '',
              backgroundColor: description.backgroundColor || '',
            },
            created: new Date(), // Set the creation date
          });

          // Save to database
          const savedSkill = await newSkill.save();

          // Clear relevant cache entries
          clearCache('skill'); // Clear all skills cache

          console.log("Skill created successfully:", savedSkill);
          res.status(201).json(savedSkill);
        } catch (error) {
          console.error("Error creating skill:", error);
          if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
          }
          res.status(500).json({ error: "Failed to create skill" });
        }
        break;

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
        break;
    }
  } catch (error) {
    console.error(`Error during ${method} request for skills:`, error);
    // Handle Mongoose validation errors specifically
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    // Return a generic 500 Internal Server Error for other issues
    res.status(500).json({ error: `Failed to process ${method} request for skills` });
  }
}
