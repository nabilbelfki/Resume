import nodemailer from "nodemailer";
import axios from "axios";

export default async function handler(req, res) {
  const {
    firstName,
    lastName,
    email,
    phone,
    notes,
    date,
    time,
    dateString,
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

    // Proceed with email sending logic
    console.log(phone);
    console.log(notes);

    const transporter = nodemailer.createTransport({
      host: "smtp.resend.com",
      port: 465,
      secure: true,
      auth: {
        user: "resend",
        pass: process.env.RESEND_API_KEY,
      },
    });

    const body = emailBody(firstName, lastName, date, time, new Date(dateString));

    // Generate the ICS content
    const icsContent = generateICSFile(
      new Date(dateString),
      "Meeting with Nabil Belfki",
      "This is a free consultation with me to get to know you and your business. You can tell me anything that you like and hopefully I can help you achieve your goals and build something truly amazing",
      "Online"
    );

    // Set up email data with attachment
    const mailOptions = {
      from: "info@nabilbelfki.com", // Sender address
      to: email, // List of recipients
      subject: "New Meeting Request", // Subject line
      bcc: "nabilbelfki@gmail.com",
      html: body,
      alternatives: [
        {
          contentType: "text/calendar",
          content: icsContent,
        },
      ],
    };

    // Send mail with defined transport object
    await transporter.sendMail(mailOptions);

    await transporter.sendMail({
      from: "info@nabilbelfki.com",
      to: "nabilbelfki@gmail.com",
      subject: `Meeting with ${firstName} ${lastName}`,
      text: `You have a meeting with ${firstName} ${lastName} at ${time} ${date.trim()}.\n
      ${notes}`,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false });
  }
}

function emailBody(firstName, lastName, date, time, dateTime) {
  const isoString = dateTime.toISOString();
  const encodedDate = encodeURIComponent(isoString);

  return `<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmation Email</title>
</head>
<body style="margin:0; padding:0; font-family:Arial,sans-serif; background:linear-gradient(to bottom,#011A49 0%,#113C8D 44%,#113C8D 60%,#011A49 85%);">
    <!-- Main Container -->
    <div style="max-width:600px; margin:0 auto;">
        <!-- Navigation -->
        <div style="background-color:#011A49; padding:15px 0; text-align:center;">
            <table align="center" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                    <td style="padding:0 10px;"><a href="https://www.nabilbelfki.com/#biography" style="color:white; text-decoration:none; font-size:12px; font-weight:600;">Biography</a></td>
                    <td style="padding:0 10px;"><a href="https://www.nabilbelfki.com/#experiences" style="color:white; text-decoration:none; font-size:12px; font-weight:600;">Experience</a></td>
                    <td style="padding:0 10px;"><a href="https://www.nabilbelfki.com/#skills" style="color:white; text-decoration:none; font-size:12px; font-weight:600;">Skills</a></td>
                    <td style="padding:0 10px;"><a href="https://www.nabilbelfki.com/#projects" style="color:white; text-decoration:none; font-size:12px; font-weight:600;">Projects</a></td>
                    <td style="padding:0 10px;"><a href="https://www.nabilbelfki.com/#contact" style="color:white; text-decoration:none; font-size:12px; font-weight:600;">Contact</a></td>
                </tr>
            </table>
        </div>
        
        <!-- Content -->
        <div style="background-color:#FFFFFF; padding:20px;">
            <!-- Profile Section -->
            <div style="text-align:center; padding:20px 0;">
                <div style="background-color:#7090cd; border-radius:50%; width:150px; height:150px; display:inline-block; text-align:center; line-height:150px;">
                    <img src="https://nabilbelfki.com/images/profile.png" alt="Profile Picture" width="140" height="140" style="border-radius:45%; vertical-align:middle;">
                </div>
                <div style="text-align:center; margin-top:20px;">
                    <h1 style="font-size:28px; margin:0; color:#3D3D3D;">Thanks for reaching out!</h1>
                    <h3 style="font-size:16px; line-height:1.4; margin:10px 0 0; color:#3D3D3D; font-weight:300;">
                        I look forward to speaking with you ${firstName} ${lastName} at <b style="font-weight:600;">${time}</b> on <b style="font-weight:600;">${date.trim()}</b>. I will give you a call then. If you need to contact me beforehand don't hesitate to send me an email.
                    </h3>
                </div>
            </div>
            
            <!-- Action Section -->
            <div style="padding:20px 0;">
                <!-- Preview Card -->
                <div style="width:100%; background:linear-gradient(to bottom,#011A49 0%,#113C8D 44%,#113C8D 60%,#011A49 85%); padding:20px; border-radius:20px; box-sizing:border-box; margin-bottom:30px;">
                    <a href="https://www.nabilbelfki.com/application/67a2432855f8ecd625cc5ea5" style="text-decoration:none; color:inherit;">
                        <img src="https://nabilbelfki.com/videos/personal.gif" alt="Project Preview GIF" style="width:100%; border-radius:10px;">
                    </a>
                </div>

                <!-- Cancel Card -->
                <div style="width:100%; box-shadow:0 0 4px 1px rgba(0,0,0,0.25); border-radius:20px; padding:20px; box-sizing:border-box; text-align:center;">
                    <div style="font-style:italic; font-size:16px; font-weight:300; color:#3D3D3D;">
                        Something unexpected came up and you need to cancel? No worries, I understand just click the button below.
                    </div>
                    <a href="https://nabilbelfki.com/email?firstName=${firstName}&lastName=${lastName}&date=${encodedDate}" style="text-decoration:none;cursor:pointer;">
                        <button style="width:150px; height:40px; color:white; background-color:#113C8D; border:none; border-radius:5px; cursor:pointer; margin-top:15px; font-weight:600;">
                            CANCEL MEETING
                        </button>
                    </a>
                </div>
            </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color:#011A49; padding:20px 0; text-align:center;">
            <table align="center" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                    <td style="padding:0 10px;"><a href="https://www.nabilbelfki.com/#biography" style="color:white; text-decoration:none; font-size:12px; font-weight:600;">Biography</a></td>
                    <td style="padding:0 10px;"><a href="https://www.nabilbelfki.com/#experiences" style="color:white; text-decoration:none; font-size:12px; font-weight:600;">Experience</a></td>
                    <td style="padding:0 10px;"><a href="https://www.nabilbelfki.com/#skills" style="color:white; text-decoration:none; font-size:12px; font-weight:600;">Skills</a></td>
                    <td style="padding:0 10px;"><a href="https://www.nabilbelfki.com/#projects" style="color:white; text-decoration:none; font-size:12px; font-weight:600;">Projects</a></td>
                    <td style="padding:0 10px;"><a href="https://www.nabilbelfki.com/#contact" style="color:white; text-decoration:none; font-size:12px; font-weight:600;">Contact</a></td>
                </tr>
            </table>
            <div style="color:white; font-weight:600; margin-top:15px; font-size:12px;">
                Copyright © 2024 Nabil Belfki. All rights reserved.
            </div>
            <div style="margin-top:15px; text-align:center;">
                <a href="https://www.github.com/nabilbelfki" target="_blank" style="display:inline-block; margin:0 5px;">
                    <img src="https://nabilbelfki.com/images/github-email.png" alt="Github Logo" width="auto" height="21">
                </a>
                <a href="https://www.linkedin.com/in/nabilbelfki" target="_blank" style="display:inline-block; margin:0 5px;">
                    <img src="https://nabilbelfki.com/images/linkedin-email.png" alt="Linkedin Logo" width="auto" height="21">
                </a>
                <a href="mailto:nabilbelfki@gmail.com" style="display:inline-block; margin:0 5px;">
                    <img src="https://nabilbelfki.com/images/mail-email.png" alt="Mail Icon" width="auto" height="21">
                </a>
            </div>
        </div>
    </div>
</body>
</html>`;
}

const generateICSFile = (
  dateTime,
  summary = "Event",
  description = "",
  location = ""
) => {
  const startDate = dateTime
    .toISOString()
    .replace(/-|:|\.\d\d\d/g, "")
    .slice(0, -1); // Format: YYYYMMDDTHHMMSSZ
  const endDate = new Date(dateTime.getTime() + 30 * 60 * 1000)
    .toISOString()
    .replace(/-|:|\.\d\d\d/g, "")
    .slice(0, -1); // 30 minutes later

  return `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Your Organization//NONSGML v1.0//EN
BEGIN:VEVENT
UID:${Math.random().toString(36).substr(2, 9)}@nabilbelfki.com
DTSTAMP:${startDate}Z
DTSTART:${startDate}Z
DTEND:${endDate}Z
SUMMARY:${summary}
DESCRIPTION:${description}
LOCATION:${location}
END:VEVENT
END:VCALENDAR
`.trim();
};
