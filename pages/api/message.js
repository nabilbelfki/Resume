import nodemailer from "nodemailer";
import axios from "axios";

export default async function handler(req, res) {
  const { firstName, lastName, email, message, recaptchaToken } = req.body;

  if (!recaptchaToken) {
    return res
      .status(400)
      .json({ success: false, error: "Missing reCAPTCHA token" });
  }

  try {
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

    const transporter = nodemailer.createTransport({
      host: "smtp.mail.us-east-1.awsapps.com", // Replace 'us-east-1' with your AWS region if different
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.MAIL_PERSONAL_ACCESS_TOKEN,
      },
    });

    const fullName = `${firstName} ${lastName}`;
    const body = `${message}\n\n${fullName},\n${email}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Message from ${fullName}`,
      bcc: "nabilbelfki@gmail.com", // BCC recipient
      text: body,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}
