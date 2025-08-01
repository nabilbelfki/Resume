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
      host: "smtp.mail.us-east-1.awsapps.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.MAIL_PERSONAL_ACCESS_TOKEN,
      },
    });

    const fullName = `${firstName} ${lastName}`;
    const emailBody = `${message}\n\n${fullName},\n${email}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
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

// GET handler - Fetch paginated messages
async function handleGetRequest(req, res) {
  const { page = 1, limit = 10, sortOrder = 'desc' } = req.query;

  try {
    // Parse parameters
    const pageNumber = parseInt(page.toString());
    const limitNumber = parseInt(limit.toString());
    const skip = (pageNumber - 1) * limitNumber;
    const sortDirection = sortOrder.toString().toLowerCase() === 'asc' ? 1 : -1;

    // Cache setup
    const cacheKey = `messages:${page}:${limit}:${sortOrder}`;
    const cachedData = getCache(cacheKey);
    
    if (cachedData) {
      console.log("Returning cached messages");
      return res.status(200).json(cachedData);
    }

    // Database operations
    const total = await Message.countDocuments();
    const data = await Message.find({})
      .skip(skip)
      .limit(limitNumber)
      .sort({ created: sortDirection });

    // Prepare response
    const responseData = {
      success: true,
      data,
      total,
      totalPages: Math.ceil(total / limitNumber),
      currentPage: pageNumber,
      limit: limitNumber,
      sortOrder
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