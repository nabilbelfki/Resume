import dbConnect from "../../lib/dbConnect";
import Meeting from "../../models/Meeting";
import axios from "axios";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    const {
      dateTimeString,
      firstName,
      lastName,
      email,
      phone,
      notes,
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
      const meeting = new Meeting({
        dateTime,
        firstName,
        lastName,
        email,
        phone,
        notes,
      });
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
    const { date } = req.query; // Expecting date in YYYY-MM-DD format

    if (!date) {
      return res
        .status(400)
        .json({ success: false, error: "Date query parameter is required" });
    }

    try {
      const startOfDay = new Date(date);
      startOfDay.setUTCHours(0, 0, 0, 0);

      const endOfDay = new Date(startOfDay);
      endOfDay.setUTCHours(23, 59, 59, 999);

      const meetings = await Meeting.find({
        dateTime: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
      });

      res.status(200).json({ success: true, meetings });
    } catch (error) {
      console.error("Error fetching meetings:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch meetings",
        details: error.message,
      });
    }
  } else {
    res.status(405).json({ success: false, error: "Method not allowed" });
  }
}
