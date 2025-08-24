import nodemailer from "nodemailer";
import axios from "axios";

export default async function handler(req, res) {
  const {
    email,
    firstName,
    lastName,
    message,
    reply,
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

    const transporter = nodemailer.createTransport({
      host: "smtp.mail.us-east-1.awsapps.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.MAIL_PERSONAL_ACCESS_TOKEN,
      },
    });

    const body = emailBody(firstName, message, reply);

    // Set up email data with attachment
    const mailOptions = {
        from: `"Nabil Belfki" <${process.env.EMAIL_USER}>`,
        to: `"${firstName} ${lastName}" <${email}>`,
        subject: "Conversation with Nabil Belfki",
        bcc: '"Nabil Belfki" <nabilbelfki@gmail.com>',
        html: body,
    };

    // Send mail with defined transport object
    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false });
  }
}

function emailBody(firstName, message, reply) {

  return `<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Conversation with Nabil Belfki</title>
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
                        <h1 style="font-size:28px; margin:0; color:#3D3D3D;">Thanks for reaching out ${firstName}!</h1>
                        <h3 style="font-size:16px; line-height:1.4; margin:10px 0 0; color:#3D3D3D; font-weight:300;">
                           ${reply}
                        </h3>
                    </div>
                </div>
                
                <!-- Message Section -->
                <div style="padding:20px 0; width: 100%; background-color: rgba(255,255,255,0.5)">
                    ${message}
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