// /pages/api/posts.js
import dbConnect from "../../lib/dbConnect";
import Post from "../../models/Post";
import { setCache, getCache, clearCache } from "../../lib/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  await dbConnect();

  const { method, query } = req;

  try {
    console.log("Connected to MongoDB for Posts API");

    switch (method) {
      case "GET":
        console.log("Processing GET request for Posts");

        const {
          page = 1,
          limit = 10, // Default to 10 posts per page
          search = '',
          sortBy = 'createdAt',
          sortOrder = 'desc',
          category = '',
          status = ''
        } = query;

        const pageNumber = parseInt(page.toString());
        const limitNumber = parseInt(limit.toString());
        const sortDirection = sortOrder.toString().toLowerCase() === 'asc' ? 1 : -1;

        // Build search conditions
        const conditions = {};
        if (search) {
          const searchRegex = new RegExp(search.toString(), 'i');
          conditions.$or = [
            { title: searchRegex },
            {
              $expr: {
                $regexMatch: {
                  input: { $concat: ["$author.firstName", " ", "$author.lastName"] },
                  regex: search.toString(),
                  options: "i"
                }
              }
            },
            { category: searchRegex },
          ];
        }

        // Add category filter if provided
        if (category) {
          conditions.category = category.toString().toUpperCase();
        }

        // Add status filter if provided
        if (status) {
          conditions.status = status.toString();
        }

        // Get total count for pagination
        const total = await Post.countDocuments(conditions);

        // Build query
        let queryBuilder = Post.find(conditions);
        let actualLimit = limitNumber;
        let actualPage = pageNumber;
        let skip = 0;

        if (limitNumber > 0) {
          skip = (pageNumber - 1) * limitNumber;
          queryBuilder = queryBuilder.skip(skip).limit(limitNumber);
        } else {
          actualLimit = total;
          actualPage = 1;
        }

        // Apply sorting
        const sortOptions = {
          [sortBy]: sortDirection,
          '_id': sortDirection
        };
        queryBuilder = queryBuilder.sort(sortOptions);

        // Build cache key
        const cacheKey = `posts:${actualPage}:${actualLimit}:${search}:${sortBy}:${sortOrder}:${category}:${status}`;

        // Check cache
        const cachedData = getCache(cacheKey);
        if (cachedData) {
          console.log(`Returning cached posts data for key: ${cacheKey}`);
          return res.status(200).json(cachedData);
        }

        // Execute query
        const data = await queryBuilder;

        console.log(`Posts fetched: ${data.length} of ${total} total, page ${actualPage}, limit ${actualLimit}`);

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
          ...(process.env.NODE_ENV === 'development' && {
            debug: {
              skip,
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
          console.log("Processing POST request for Posts");
          const session = await getServerSession(req, res, authOptions);
          if (!session || !session.user) {
            return res.status(401).json({ error: "Unauthorized" });
          }

          const {
            title,
            author,
            date,
            readTime,
            category,
            status,
            content,
            thumbnail,
            visibility,
            banner,
            slug,
            tags
          } = req.body;

          // Basic validation
          if (!title || !author || !content || !slug) {
            return res.status(400).json({ error: "Missing required fields" });
          }

          // Create new post document
          const newPost = new Post({
            title,
            author,
            date: date || new Date().toISOString(),
            readTime: readTime || 5,
            views: 0,
            category: category || 'OTHER',
            status: status || 'Draft',
            content,
            visibility,
            thumbnail,
            banner,
            slug,
            tags: tags || [],
            createdAt: new Date(),
            updatedAt: new Date()
          });

          // Save to database
          const savedPost = await newPost.save();

          // Clear relevant cache entries
          clearCache('posts'); // Clear all posts cache

          console.log("Post created successfully:", savedPost);
          res.status(201).json(savedPost);
        } catch (error) {
          console.error("Error creating post:", error);
          if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
          }
          if (error.code === 11000) { // Duplicate key error (slug)
            return res.status(400).json({ error: "Slug must be unique" });
          }
          res.status(500).json({ error: "Failed to create post" });
        }
        break;

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
        break;
    }
  } catch (error) {
    console.error(`Error during ${method} request for posts:`, error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: `Failed to process ${method} request for posts` });
  }
}