import dbConnect from "../../lib/dbConnect";
import Meeting from "../../models/Meeting";
import axios from "axios";
import { clearCache, getCache, setCache } from "../../lib/cache";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    // Keep the existing POST handler exactly as is
    const {
      dateTimeString,
      firstName,
      lastName,
      email,
      phone = "",
      notes = "",
      recaptchaToken,
    } = req.body;

    // Check if the reCAPTCHA token is present
    if (!recaptchaToken) {
      return res
        .status(400)
        .json({ success: false, error: "Missing reCAPTCHA token" });
    }

    try {
      // Verify the reCAPTCHA token
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

      let dateTime = new Date(dateTimeString);
      console.log("Parsed dateTime:", dateTime);

      // Create the meeting object with required and optional fields
      const meeting = new Meeting({
        dateTime,
        firstName,
        lastName,
        email,
        phone,
        notes,
      });
      clearCache('meeting');
      await meeting.save();

      res
        .status(201)
        .json({ success: true, message: "Meeting saved successfully" });

    } catch (error) {
      console.error("Error saving meeting:", error);
      if (error.code === 11000) {
        // Duplicate key error
        res.status(400).json({
          success: false,
          error: "Meeting already exists for the given dateTime",
        });
      } else {
        res.status(500).json({
          success: false,
          error: "Failed to save meeting",
          details: error.message,
        });
      }
    }
  } else if (req.method === "GET") {
      const { 
          date, 
          page = 1, 
          limit = 10, 
          sortOrder = 'desc',
          search = ''  // Add search parameter
      } = req.query;

      try {
          // Parse pagination parameters
          const pageNumber = parseInt(page.toString());
          const limitNumber = parseInt(limit.toString());
          const skip = (pageNumber - 1) * limitNumber;
          
          // Validate sort order
          const sortDirection = sortOrder.toString().toLowerCase() === 'asc' ? 1 : -1;

          // Create cache key with all parameters (include search)
          const cacheKey = `meetings:${date || 'all'}:${page}:${limit}:${sortOrder}:${search}`;
          
          // Check cache
          const cachedData = getCache(cacheKey);
          if (cachedData) {
              console.log("Returning cached meetings data");
              return res.status(200).json(cachedData);
          }

          // Build query conditions
          const conditions = {};
          if (date) {
              const startOfDay = new Date(date);
              startOfDay.setUTCHours(0, 0, 0, 0);
              const endOfDay = new Date(startOfDay);
              endOfDay.setUTCHours(23, 59, 59, 999);
              
              conditions.dateTime = {
                  $gte: startOfDay,
                  $lt: endOfDay
              };
          }

          // Add search condition
          if (search) {
              const searchRegex = new RegExp(search.toString(), 'i');
              const searchTerms = search.toString().trim().split(/\s+/); // Split search query into terms
              
              conditions.$or = [
                  { firstName: searchRegex },
                  { lastName: searchRegex },
                  { email: searchRegex },
                  // Combined name search
                  ...(searchTerms.length > 1 ? [{
                      $expr: {
                          $regexMatch: {
                              input: { $concat: ["$firstName", " ", "$lastName"] },
                              regex: search,
                              options: "i"
                          }
                      }
                  }] : [])
              ];
          }

          // Get total count
          const total = await Meeting.countDocuments(conditions);

          // Fetch paginated meetings
          const data = await Meeting.find(conditions)
              .skip(skip)
              .limit(limitNumber)
              .sort({ dateTime: sortDirection });

          // Prepare response
          const responseData = {
              success: true,
              data,
              total,
              totalPages: Math.ceil(total / limitNumber),
              currentPage: pageNumber,
              limit: limitNumber,
              sortOrder,
              searchQuery: search  // Optionally include the search query in response
          };

          // Cache the response
          setCache(cacheKey, responseData);

          res.status(200).json(responseData);
      } catch (error) {
          console.error("Error fetching meetings:", error);
          res.status(500).json({
              success: false,
              error: "Failed to fetch meetings",
              details: error.message,
          });
      }
  } else if (req.method === "DELETE") {
    // Keep the existing DELETE handler exactly as is
    const { firstName, lastName, dateTimeString } = req.body;

    if (!firstName || !lastName || !dateTimeString) {
      return res.status(400).json({
        success: false,
        error: "firstName, lastName, and dateTimeString are required",
      });
    }

    try {
      const dateTime = new Date(dateTimeString);
      
      const deletedMeeting = await Meeting.findOneAndDelete({
        firstName,
        lastName,
        dateTime,
      });

      if (!deletedMeeting) {
        return res.status(404).json({
          success: false,
          error: "Meeting not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Meeting deleted successfully",
        deletedMeeting,
      });
    } catch (error) {
      console.error("Error deleting meeting:", error);
      res.status(500).json({
        success: false,
        error: "Failed to delete meeting",
        details: error.message,
      });
    }
  } else {
    res.status(405).json({ success: false, error: "Method not allowed" });
  }
}