import dbConnect from "../../lib/dbConnect";
import Media from "../../models/Media";
import { getCache, setCache } from "../../lib/cache";
import { handleFileUpload, saveMediaToDatabase } from "../../lib/mediaUtilities";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  await dbConnect();

  const { method, query } = req;

  try {
    switch (method) {
      case "GET":
        // Your existing GET implementation remains exactly the same
        console.log("Fetching media documents");
        const { 
          page = 1, 
          limit = 25, 
          search = '',
          type = '',
          sortBy = 'created', 
          sortOrder = 'desc',
          directory = ''
        } = query;
        
        const pageNumber = parseInt(page.toString());
        const limitNumber = parseInt(limit.toString());
        const skip = (pageNumber - 1) * limitNumber;
        const sortDirection = sortOrder.toString().toLowerCase() === 'asc' ? 1 : -1;
        const cacheKey = `media:${page}:${limit}:${search}:${type}:${sortBy}:${sortOrder}:${directory}`;

        const cachedData = getCache(cacheKey);
        if (cachedData) {
          console.log("Returning cached media data");
          return res.status(200).json(cachedData);
        }

        const conditions = {};
        if (search) {
          const searchRegex = new RegExp(search.toString(), 'i');
          conditions.$or = [
            { fileName: searchRegex },
            // { description: searchRegex },
            // { 'metadata.directory': searchRegex }
          ];
        }

        if (type) {
          conditions.type = type.toString();
        }

        if (directory) {
          conditions['metadata.directory'] = { $regex: new RegExp(`^${directory}`) };
        }

        const total = await Media.countDocuments(conditions);
        const sortOptions = {};
        sortOptions[sortBy.toString()] = sortDirection;

        const data = await Media.find(conditions)
          .skip(skip)
          .limit(limitNumber)
          .sort(sortOptions);

        const responseData = {
          data,
          total,
          totalPages: Math.ceil(total / limitNumber),
          currentPage: pageNumber,
          limit: limitNumber,
          sortBy,
          sortOrder
        };

        setCache(cacheKey, responseData);
        res.status(200).json(responseData);
        break;

      case "POST":
        try {
          const uploadResult = await handleFileUpload(req);
          const newMedia = await saveMediaToDatabase(uploadResult);
          
          return res.status(201).json(newMedia);
        } catch (error) {
          console.error('Upload error:', error);
          return res.status(400).json({ 
            error: error.message || "File upload failed",
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
          });
        }

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error(`Error during ${method} request:`, error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return res.status(500).json({ 
      error: errorMessage,
      ...(process.env.NODE_ENV === 'development' && { details: error instanceof Error ? error.stack : undefined })
    });
  }
}