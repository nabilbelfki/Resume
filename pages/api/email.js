// /pages/api/send-email.js
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { firstName, lastName, email, phone, notes } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    try {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: "nabilbelfki@gmail.com",
        subject: "Meeting Confirmation",
        text: `Name: ${firstName} ${lastName}\nEmail: ${email}\nPhone: ${phone}\nNotes: ${notes}`,
      });
      res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
