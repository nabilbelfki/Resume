// pages/api/posts/[id]/comments.ts
import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";
import { setCache, getCache, clearCache } from "@/lib/cache";
import mongoose from "mongoose";

export default async function handler(req, res) {
  await dbConnect();

  const { query: { id }, method } = req;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid post ID format" });
  }

  try {
    switch (method) {
      case "GET":
        // Corrected line: Pass the entire 'req' object to the handler
        return handleGetComments(id, req, res);
      case "POST":
        return handleAddComment(id, req, res);
      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error(`Error during ${method} request for post comments ${id}:`, error);
    return handleErrorResponse(error, res);
  }
}

async function handleGetComments(id, req, res) {
  const {
    query: {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'date',
      sortOrder = 'desc'
    },
  } = req;

  const pageNumber = parseInt(page.toString());
  const limitNumber = parseInt(limit.toString());

  const cacheKey = `post-comments-${id}:${pageNumber}:${limitNumber}:${search}:${sortBy}:${sortOrder}`;
  const cachedData = getCache(cacheKey);
  if (cachedData) {
    console.log(`Returning cached comments for post: ${id}`);
    return res.status(200).json(cachedData);
  }

  const post = await Post.findById(id).select('comments');
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  let comments = post.comments;
  
  // Apply Search Filtering
  if (search) {
    const searchLower = search.toString().toLowerCase();
    comments = comments.filter(comment => {
      const fullName = `${comment.author.firstName} ${comment.author.lastName}`.toLowerCase();
      return fullName.includes(searchLower) || comment.text.toLowerCase().includes(searchLower);
    });
  }

  // Apply Sorting
  // NOTE: This assumes the 'date' and 'time' strings can be parsed into a valid Date object.
  const sortDirection = sortOrder.toString().toLowerCase() === 'asc' ? 1 : -1;
  if (sortBy === 'date') {
    comments.sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return (dateA.getTime() - dateB.getTime()) * sortDirection;
    });
  } else if (sortBy === 'author.firstName') {
    comments.sort((a, b) => {
      const authorA = `${a.author.firstName} ${a.author.lastName}`.toLowerCase();
      const authorB = `${b.author.firstName} ${b.author.lastName}`.toLowerCase();
      return authorA.localeCompare(authorB) * sortDirection;
    });
  } else if (sortBy === 'text') {
    comments.sort((a, b) => {
      const textA = a.text.toLowerCase();
      const textB = b.text.toLowerCase();
      return textA.localeCompare(textB) * sortDirection;
    });
  }

  // Paginate the sorted and filtered results
  const total = comments.length;
  const startIndex = (pageNumber - 1) * limitNumber;
  const endIndex = startIndex + limitNumber;
  const paginatedComments = comments.slice(startIndex, endIndex);

  const totalPages = limitNumber > 0 ? Math.ceil(total / limitNumber) : 1;
  
  const response = {
    data: paginatedComments,
    total,
    totalPages,
    currentPage: pageNumber,
    limit: limitNumber,
    sortBy,
    sortOrder,
    // Add a debug property in development mode
    ...(process.env.NODE_ENV === 'development' && {
      debug: {
        searchConditions: search,
      }
    })
  };

  setCache(cacheKey, response);
  return res.status(200).json(response);
}

async function handleAddComment(id, req, res) {
  const { firstName, lastName, text } = req.body;
  
  if (!firstName || !lastName || !text) {
    return res.status(400).json({ error: "Name and text are required" });
  }

  const newComment = {
    author: {
      firstName,
      lastName,
    },
    text,
    date: new Date().toLocaleDateString('en-US'),
    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  };

  clearCache(`post`);

  const updatedPost = await Post.findByIdAndUpdate(
    id,
    { $push: { comments: newComment } },
    { new: true }
  );

  if (!updatedPost) {
    return res.status(404).json({ error: "Post not found" });
  }

  console.log("Comment added to post:", id);
  return res.status(201).json(newComment);
}

function handleErrorResponse(error, res) {
  if (error.name === "CastError") {
    return res.status(400).json({ error: "Invalid ID format" });
  }
  if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }
  return res.status(500).json({ error: "Internal server error" });
}