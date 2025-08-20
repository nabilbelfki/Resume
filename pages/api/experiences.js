// /pages/api/experiences.js
import dbConnect from "../../lib/dbConnect";
import Experience from "../../models/Experience";
import { setCache, getCache, clearCache } from "../../lib/cache";

export default async function handler(req, res) {
  await dbConnect();

  const { method, query } = req;

  try {
    console.log("Connected to MongoDB for Experiences API");

    switch (method) {
      case "GET":
        console.log("Processing GET request for Experiences");

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

        // Build conditions
        const conditions = {};
        
        // Add status filter condition if provided
        if (status) {
          const statusValue = status.toString().toLowerCase();
          if (statusValue === 'active' || statusValue === 'inactive') {
            conditions.status = statusValue.charAt(0).toUpperCase() + statusValue.slice(1);
          }
          // If status is provided but not valid, it will be ignored
        }
        
        if (search) {
          const searchRegex = new RegExp(search.toString(), 'i');
          conditions.$or = [
            { name: searchRegex },
            { type: searchRegex },
            { title: searchRegex }
          ];
        }

        // Update cache key to include status
        const cacheKey = `experiences:${page}:${limit}:${search}:${sortBy}:${sortOrder}:${status}`;

        const cachedData = getCache(cacheKey);
        if (cachedData) {
          console.log(`Returning cached experiences data for key: ${cacheKey}`);
          return res.status(200).json(cachedData);
        }

        const total = await Experience.countDocuments(conditions);
        const sortOptions = {
          [sortBy]: sortDirection,
          '_id': sortDirection
        };

        let queryBuilder = Experience.find(conditions)
          .sort(sortOptions);
        if (limitNumber > 0) {
          queryBuilder = queryBuilder.skip(skip).limit(limitNumber);
        } else {
          limitNumber = total;
        }

        const data = await queryBuilder;

        console.log(`Experiences fetched: ${data.length} of ${total} total, sorted by ${sortBy} ${sortOrder}`);
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

        res.status(200).json(responseData);
        break;

      case "POST":
        try {
          console.log("Processing POST request for Experiences");
          const {
            level,
            zIndex,
            status,
            name,
            location,
            type,
            logo,
            title,
            subtitle,
            period,
            color,
            description
          } = req.body;

          // Basic validation
          if (!name || !title || !type || !period?.start) {
            return res.status(400).json({ error: "Missing required fields" });
          }

          // Create new experience document
          const newExperience = new Experience({
            level: level || 0,
            zIndex: zIndex || 0,
            name,
            location,
            type,
            status,
            logo: {
              opened: {
                name: logo?.opened?.name || '',
                width: logo?.opened?.width || 0,
                height: logo?.opened?.height || 0,
                path: logo?.opened?.path || '',
              },
              closed: {
                name: logo?.closed?.name || '',
                width: logo?.closed?.width || 0,
                height: logo?.closed?.height || 0,
                path: logo?.closed?.path || '',
              }
            },
            title,
            subtitle,
            period: {
              title: period?.title || '',
              start: new Date(period.start),
              ...(period?.end && { end: new Date(period.end) }),
            },
            color: {
              line: color?.line || '',
              name: color?.name || '',
              title: color?.title || '',
              subtitle: color?.subtitle || '',
              type: color?.type || '',
              date: color?.date || '',
              location: color?.location || '',
              background: color?.background || '',
              details: color?.details || '',
              description: {
                text: color?.description?.text || '',
                background: color?.description?.background || '',
              }
            },
            description,
            created: new Date(),
          });

          // Save to database
          const savedExperience = await newExperience.save();

          // Clear relevant cache entries
          clearCache('experiences');

          console.log("Experience created successfully:", savedExperience);
          res.status(201).json(savedExperience);
        } catch (error) {
          console.error("Error creating experience:", error);
          if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
          }
          res.status(500).json({ error: "Failed to create experience" });
        }
        break;

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
        break;
    }
  } catch (error) {
    console.error(`Error during ${method} request for experiences:`, error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: `Failed to process ${method} request for experiences` });
  }
}