import dbConnect from "../../lib/dbConnect";
import Media from "../../models/Media";
import { setCache, getCache, clearCache } from "../../lib/cache";
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Use CommonJS require for formidable to avoid Turbopack issues
const formidable = require('formidable');

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
            { description: searchRegex },
            { 'metadata.directory': searchRegex }
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
        clearCache('media');
        
        // Initialize formidable correctly
        const form = new formidable.IncomingForm();
        form.keepExtensions = true;
        form.maxFileSize = 50 * 1024 * 1024;

        const { fields, files } = await new Promise((resolve, reject) => {
          form.parse(req, (err, fields, files) => {
            if (err) {
              if (err.code === 'LIMIT_FILE_SIZE') {
                reject(new Error('File size exceeds 50MB limit'));
              } else {
                reject(err);
              }
            }
            resolve({ fields, files });
          });
        });

        if (!files?.file) {
          return res.status(400).json({ error: "No file uploaded" });
        }

        const file = files.file;
        
        if (!file.filepath) {
          return res.status(400).json({ error: "Invalid file path" });
        }

        // Get and validate file type
        const fileType = String(fields?.type || 'Image').toLowerCase();
        if (!['image', 'video', 'sound'].includes(fileType)) {
          return res.status(400).json({ error: "Invalid file type specified" });
        }

        // Get file extension
        const originalFilename = file.originalFilename || file.newFilename;
        const ext = path.extname(originalFilename) || 
                   (fileType === 'image' ? '.jpg' : 
                    fileType === 'video' ? '.mp4' : '.mp3');

        // Create upload directory
        const typeDir = `${fileType}s`;
        const uploadDir = path.join(process.cwd(), 'public', typeDir);
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Generate unique filename and move file
        const fileName = `${uuidv4()}${ext}`;
        const newPath = path.join(uploadDir, fileName);
        
        try {
          await fs.promises.rename(file.filepath, newPath);
        } catch (err) {
          console.error('File move error:', err);
          return res.status(500).json({ error: "Failed to save file" });
        }

        const relativePath = `/${typeDir}/${fileName}`;

        // Get dimensions for images
        let dimensions = { width: null, height: null };
        if (fileType === 'image') {
          try {
            const sizeOf = await import('image-size');
            const imageDimensions = sizeOf.default(newPath);
            dimensions = {
              width: imageDimensions.width,
              height: imageDimensions.height
            };
          } catch (err) {
            console.error('Could not get image dimensions:', err);
          }
        }

        // Create media document
        const mediaDoc = await Media.create({
          fileName,
          path: relativePath,
          url: `${process.env.NEXT_PUBLIC_BASE_URL || ''}${relativePath}`,
          fileSize: file.size,
          description: fields.description || '',
          type: fileType,
          extension: ext.replace('.', ''),
          dimensions,
          backgroundColor: fields.backgroundColor || '#ffffff',
          created: new Date(),
          lastModified: new Date(),
          metadata: {
            directory: fileType,
            ...(fields.metadata && JSON.parse(fields.metadata))
          }
        });

        res.status(201).json(mediaDoc);
        break;

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
        break;
    }
  } catch (error) {
    console.error(`Error during ${method} request:`, error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ 
      error: error.message || `Failed to process ${method} request`,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}