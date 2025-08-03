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
        let limitNumber = parseInt(limit.toString());
        const skip = (pageNumber - 1) * limitNumber;

        const sortDirection = sortOrder.toString().toLowerCase() === 'asc' ? 1 : -1;

        const cacheKey = `skills:${page}:${limit}:${search}:${sortBy}:${sortOrder}`;

        const cachedData = getCache(cacheKey);
        if (cachedData) {
          console.log(`Returning cached skills data for key: ${cacheKey}`);
          return res.status(200).json(cachedData);
        }

        const conditions = {};
        if (search) {
          const searchRegex = new RegExp(search.toString(), 'i');
          conditions.$or = [
            { name: searchRegex },
            { type: searchRegex }
          ];
        }

        const total = await Skill.countDocuments(conditions);
        const sortOptions = {};
        sortOptions[sortBy.toString()] = sortDirection;

        let queryBuilder = Skill.find(conditions)
          .sort(sortOptions);
        if (limitNumber > 0) {
          queryBuilder = queryBuilder.skip(skip).limit(limitNumber);
        } else {
          limitNumber = total;
        }

        const data = await queryBuilder;

        console.log(`Skills fetched: ${data.length} of ${total} total, sorted by ${sortBy} ${sortOrder}`);

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

        res.status(200).json(responseData); // Send the response
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
