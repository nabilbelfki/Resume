import nodemailer from "nodemailer";
import axios from "axios";
import dbConnect from "../../lib/dbConnect";
import Message from "../../models/Message";
import { getCache, setCache, clearCache } from "../../lib/cache";

export default async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case "POST":
      return handlePostRequest(req, res);
    case "GET":
      return handleGetRequest(req, res);
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).json({
        success: false,
        error: `Method ${req.method} not allowed`
      });
  }
}

// POST handler - Create new message
async function handlePostRequest(req, res) {
  const { firstName, lastName, email, message, recaptchaToken } = req.body;

  if (!recaptchaToken) {
    return res.status(400).json({
      success: false,
      error: "Missing reCAPTCHA token"
    });
  }

  try {
    // Verify reCAPTCHA
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_V3;
    const recaptchaResponse = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${recaptchaToken}`
    );

    const { success, "error-codes": errorCodes } = recaptchaResponse.data;

    if (!success) {
      console.error("reCAPTCHA validation failed:", errorCodes);
      return res.status(400).json({
        success: false,
        error: "reCAPTCHA validation failed",
        errorCodes,
      });
    }

    // Create and save message
    const newMessage = new Message({
      firstName,
      lastName,
      email,
      message: message || "",
      created: new Date()
    });

    await newMessage.save();

    // Clear messages cache since we added a new message
    clearCache('message');

    // Send email notification
    const transporter = nodemailer.createTransport({
      host: "smtp.resend.com",
      port: 465,
      secure: true,
      auth: {
        user: "resend",
        pass: process.env.RESEND_API_KEY,
      },
    });

    const fullName = `${firstName} ${lastName}`;
    const emailBody = `${message}\n\n${fullName},\n${email}`;

    await transporter.sendMail({
      from: "info@nabilbelfki.com",
      to: "info@nabilbelfki.com",
      subject: `Message from ${fullName}`,
      bcc: "nabilbelfki@gmail.com",
      text: emailBody,
    });

    return res.status(200).json({
      success: true,
      messageId: newMessage._id
    });

  } catch (error) {
    console.error("Error processing message:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: error.message
    });
  }
}

async function handleGetRequest(req, res) {
  const {
    page = 1,
    limit = 10,
    sortBy = 'created',
    sortOrder = 'desc',
    search = ''
  } = req.query;

  try {
    // Parse parameters
    const pageNumber = parseInt(page.toString());
    const limitNumber = parseInt(limit.toString());
    const skip = (pageNumber - 1) * limitNumber;
    const sortDirection = sortOrder.toString().toLowerCase() === 'asc' ? 1 : -1;

    // Cache setup (include sortBy in cache key)
    const cacheKey = `messages:${page}:${limit}:${sortBy}:${sortOrder}:${search}`;
    const cachedData = getCache(cacheKey);

    if (cachedData) {
      console.log("Returning cached messages");
      return res.status(200).json(cachedData);
    }

    // Build query conditions
    const conditions = {};
    if (search) {
      const searchRegex = new RegExp(search.toString(), 'i');
      const searchTerms = search.toString().trim().split(/\s+/);

      conditions.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        // Combined name search for "firstName lastName" or "lastName firstName"
        ...(searchTerms.length > 1 ? [
          {
            $and: [
              { firstName: new RegExp(searchTerms[0], 'i') },
              { lastName: new RegExp(searchTerms[1], 'i') }
            ]
          },
          {
            $and: [
              { firstName: new RegExp(searchTerms[1], 'i') },
              { lastName: new RegExp(searchTerms[0], 'i') }
            ]
          }
        ] : [])
      ];
    }

    const sortOptions = {
      [sortBy]: sortDirection,
      '_id': sortDirection
    };

    // Database operations
    const total = await Message.countDocuments(conditions);
    const data = await Message.find(conditions)
      .skip(skip)
      .limit(limitNumber)
      .sort(sortOptions); // Use the enhanced sort options

    // 🐛 DEBUG: Log the actual _id values to verify different results
    console.log(`Messages fetched: ${data.length} of ${total}, sorted by ${sortBy} ${sortOrder} + _id`);
    console.log(`First message ID: ${data[0]?._id}, Last message ID: ${data[data.length - 1]?._id}`);

    // Prepare response
    const responseData = {
      success: true,
      data,
      total,
      totalPages: Math.ceil(total / limitNumber),
      currentPage: pageNumber,
      limit: limitNumber,
      sortBy,  // Include sortBy in response
      sortOrder,
      searchQuery: search,
      // Add debug info in development
      ...(process.env.NODE_ENV === 'development' && {
        debug: {
          skip,
          searchConditions: conditions,
          sortOptions,
          firstId: data[0]?._id,
          lastId: data[data.length - 1]?._id
        }
      })
    };

    // Cache response
    setCache(cacheKey, responseData);

    return res.status(200).json(responseData);

  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch messages",
      details: error.message,
    });
  }
}