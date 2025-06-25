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
      host: "smtp.mail.us-east-1.awsapps.com", // Replace 'us-east-1' with your AWS region if different
      port: 465,
      secure: true, // Use SSL
      auth: {
        user: process.env.EMAIL_USER, // Your Amazon WorkMail email
        pass: process.env.MAIL_PERSONAL_ACCESS_TOKEN, // Use the token value here
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
      from: process.env.EMAIL_USER, // Sender address
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
      from: process.env.EMAIL_USER,
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
          <nav style="background-color:#011A49; padding:15px 0;">
              <ul style="list-style:none; margin:0; padding:0; display:flex; flex-wrap:wrap; justify-content:center; gap:10px;">
                  <li><a href="https://www.nabilbelfki.com/#biography" style="color:white; text-decoration:none; font-size:14px; font-weight:600;">Biography</a></li>
                  <li><a href="https://www.nabilbelfki.com/#experiences" style="color:white; text-decoration:none; font-size:14px; font-weight:600;">Experience</a></li>
                  <li><a href="https://www.nabilbelfki.com/#skills" style="color:white; text-decoration:none; font-size:14px; font-weight:600;">Skills</a></li>
                  <li><a href="https://www.nabilbelfki.com/#projects" style="color:white; text-decoration:none; font-size:14px; font-weight:600;">Projects</a></li>
                  <li><a href="https://www.nabilbelfki.com/#contact" style="color:white; text-decoration:none; font-size:14px; font-weight:600;">Contact</a></li>
              </ul>
          </nav>
          
          <!-- Content -->
          <div style="background-color:#FFFFFF; padding:20px;">
              <!-- Profile Section -->
              <div style="display:flex; flex-direction:column; align-items:center; padding:20px 0;">
                  <div style="background-color:#7090cd; border-radius:50%; width:150px; height:150px; display:flex; justify-content:center; align-items:center;">
                      <img src="https://nabilbelfki.com/images/profile.png" alt="Profile Picture" width="140" height="140" style="border-radius:45%;">
                  </div>
                  <div style="text-align:center; margin-top:20px;">
                      <h1 style="font-size:28px; margin:0; color:#3D3D3D;">Thanks for reaching out!</h1>
                      <h3 style="font-size:16px; line-height:1.4; margin:10px 0 0; color:#3D3D3D; font-weight:300;">
                          I look forward to speaking with you ${firstName} ${lastName} at <b style="font-weight:600;">${time}</b> on <b style="font-weight:600;">${date.trim()}</b>. I will give you a call then. If you need to contact me beforehand don't hesitate to send me an email.
                      </h3>
                  </div>
              </div>
              
              <!-- Action Section -->
              <div style="display:flex; flex-direction:column; gap:30px; padding:20px 0;">
                  <!-- Preview Card -->
                  <div style="width:100%; background:linear-gradient(to bottom,#011A49 0%,#113C8D 44%,#113C8D 60%,#011A49 85%); padding:20px; border-radius:20px; box-sizing:border-box;">
                      <a href="https://www.nabilbelfki.com/application/67a2432855f8ecd625cc5ea5" style="text-decoration:none; color:inherit;">
                          <img src="https://nabilbelfki.com/videos/personal.gif" alt="Project Preview GIF" style="width:100%; border-radius:10px;">
                      </a>
                  </div>

                  <!-- Cancel Card -->
                  <div style="width:100%; box-shadow:0 0 4px 1px rgba(0,0,0,0.25); border-radius:20px; padding:20px; box-sizing:border-box; text-align:center;">
                      <div style="font-style:italic; font-size:16px; font-weight:300; color:#3D3D3D;">
                          Something unexpected came up and you need to cancel? No worries, I understand just click the button below.
                      </div>
                      <a href="https://nabilbelfki.com/email?firstName=${firstName}&lastName=${lastName}&date=${encodedDate}" style="text-decoration:none;">
                          <button style="width:150px; height:40px; color:white; background-color:#113C8D; border:none; border-radius:5px; cursor:pointer; margin-top:15px; font-weight:600;">
                              CANCEL MEETING
                          </button>
                      </a>
                  </div>
              </div>
          </div>
          
          <!-- Footer -->
          <footer style="background-color:#011A49; padding:20px 0; text-align:center;">
              <ul style="list-style:none; margin:0; padding:0; display:flex; flex-wrap:wrap; justify-content:center; gap:10px;">
                  <li><a href="https://www.nabilbelfki.com/#biography" style="color:white; text-decoration:none; font-size:14px; font-weight:600;">Biography</a></li>
                  <li><a href="https://www.nabilbelfki.com/#experiences" style="color:white; text-decoration:none; font-size:14px; font-weight:600;">Experience</a></li>
                  <li><a href="https://www.nabilbelfki.com/#skills" style="color:white; text-decoration:none; font-size:14px; font-weight:600;">Skills</a></li>
                  <li><a href="https://www.nabilbelfki.com/#projects" style="color:white; text-decoration:none; font-size:14px; font-weight:600;">Projects</a></li>
                  <li><a href="https://www.nabilbelfki.com/#contact" style="color:white; text-decoration:none; font-size:14px; font-weight:600;">Contact</a></li>
              </ul>
              <div style="color:white; font-weight:600; margin-top:15px; font-size:12px;">
                  Copyright © 2024 Nabil Belfki. All rights reserved.
              </div>
              <div style="display:flex; justify-content:center; gap:10px; margin-top:15px;">
                  <a href="https://www.github.com/nabilbelfki" target="_blank">
                      <svg height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" clipRule="evenodd"
                              d="M2.5 0C1.11929 0 0 1.11929 0 2.5V18.5C0 19.8807 1.11929 21 2.5 21H18.5C19.8807 21 21 19.8807 21 18.5V2.5C21 1.11929 19.8807 0 18.5 0H2.5ZM4.36349 5.00061C4.09632 4.35938 4.1292 3.04405 4.42926 2.23841L4.51147 2.01233H4.80742C5.48975 2.01233 6.4968 2.40282 7.52852 3.0646L7.77103 3.21669L8.00122 3.16736C9.20968 2.90018 10.0523 2.81386 11.1251 2.84675C11.9513 2.87552 12.4775 2.93718 13.2502 3.1057L13.7517 3.21258L14.0518 3.0235C14.5286 2.71521 15.2767 2.3535 15.7576 2.18908C16.107 2.07399 16.2878 2.03699 16.6002 2.02055L16.9989 2L17.0483 2.1192C17.3565 2.92484 17.4264 4.05932 17.2127 4.82386L17.1346 5.10748L17.3565 5.38699C17.8087 5.9419 18.1211 6.62012 18.2608 7.34355C18.3472 7.77926 18.3595 8.77809 18.2814 9.39054C18.0471 11.2567 17.1798 12.572 15.7042 13.3078C15.1369 13.5914 14.1299 13.875 13.316 13.9778L12.9378 14.0271L13.1146 14.2573C13.3489 14.5532 13.4927 14.8492 13.6037 15.2397C13.6859 15.5397 13.69 15.6672 13.7024 17.5292C13.7106 18.6143 13.727 19.5433 13.7353 19.5926C13.764 19.7159 13.9079 19.8475 14.0641 19.8886C14.2573 19.9379 13.0776 19.9708 10.0153 19.9913C7.68883 20.0078 7.30656 20.0037 7.43809 19.9543C7.64772 19.8803 7.74637 19.7858 7.79981 19.6049C7.84502 19.457 7.84091 17.5374 7.79159 17.4922C7.77925 17.4799 7.54907 17.5004 7.27778 17.5333C6.42693 17.6484 5.68705 17.5456 5.04582 17.2332C4.81564 17.1181 4.643 16.9907 4.40049 16.7482C4.09221 16.444 4.04288 16.3742 3.78803 15.8439C3.35233 14.9396 3.04816 14.5409 2.5138 14.1792C2.24251 13.9942 2 13.764 2 13.69C2 13.5338 2.36994 13.4229 2.71932 13.4804C3.38932 13.5914 3.91546 13.9778 4.42515 14.7341C5.1157 15.7617 6.01177 16.1193 7.19969 15.8439C7.33533 15.8151 7.53263 15.7535 7.63539 15.7083C7.82447 15.6261 7.82858 15.6219 7.89024 15.3383C7.98067 14.9437 8.1533 14.5738 8.3876 14.2902C8.5068 14.1422 8.56024 14.0477 8.52735 14.0394C8.50329 14.0326 8.33265 14.0056 8.12598 13.9729C8.08549 13.9665 8.04363 13.9598 8.00122 13.9531C4.76631 13.4722 3.19202 11.6431 3.19202 8.35883C3.19202 7.22024 3.45509 6.36938 4.05932 5.5473C4.16619 5.39932 4.29362 5.24312 4.33883 5.20202C4.40871 5.13625 4.41282 5.1157 4.36349 5.00061Z"
                              fill="white" />
                      </svg>
                  </a>
                  <a href="https://www.linkedin.com/in/nabilbelfki" target="_blank">
                      <svg height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                              d="M18.5 0H2.5C1.12 0 0 1.12 0 2.5V18.5C0 19.88 1.12 21 2.5 21H18.5C19.88 21 21 19.88 21 18.5V2.5C21 1.12 19.88 0 18.5 0ZM6.5 8V17.5H3.5V8H6.5ZM3.5 5.235C3.5 4.535 4.1 4 5 4C5.9 4 6.465 4.535 6.5 5.235C6.5 5.935 5.94 6.5 5 6.5C4.1 6.5 3.5 5.935 3.5 5.235ZM17.5 17.5H14.5C14.5 17.5 14.5 12.87 14.5 12.5C14.5 11.5 14 10.5 12.75 10.48H12.71C11.5 10.48 11 11.51 11 12.5C11 12.955 11 17.5 11 17.5H8V8H11V9.28C11 9.28 11.965 8 13.905 8C15.89 8 17.5 9.365 17.5 12.13V17.5Z"
                              fill="white" />
                      </svg>
                  </a>
                  <a href="mailto:nabilbelfki@gmail.com">
                      <svg height="21" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                              d="M1.60602 0.0145092C1.55874 0.0231047 1.4255 0.0617876 1.30946 0.10047L1.10315 0.164941L3.4155 2.48589C7.31814 6.39282 9.8368 8.85131 10.0689 8.98025C10.6448 9.29831 11.3497 9.29831 11.9257 8.98025C12.1578 8.85131 14.6764 6.39282 18.579 2.48589L20.8914 0.169239L20.6851 0.0875759C20.4831 0.010211 20.1693 0.00591278 11.0832 0.00161457C5.91697 -0.00268364 1.6533 0.00161457 1.60602 0.0145092Z"
                              fill="white" />
                          <path
                              d="M0.097244 1.30379C0.019879 1.5015 0.015581 1.78947 0.0026868 7.59184C-0.00590931 13.6693 -0.00161125 13.8971 0.135927 14.228L0.187503 14.3484L3.5185 11.0389L6.84949 7.72508L4.95835 5.82964C3.91822 4.78521 2.41819 3.29379 1.62305 2.51584L0.174609 1.10178L0.097244 1.30379Z"
                              fill="white" />
                          <path
                              d="M18.4713 4.40714L15.1447 7.72094L18.4713 11.0347C20.947 13.4932 21.8109 14.3313 21.8367 14.2841C21.8539 14.2497 21.8969 14.1078 21.9356 13.9703C21.9915 13.7511 22.0001 12.9474 22.0001 7.72094C22.0001 2.4945 21.9915 1.69076 21.9356 1.47156C21.8969 1.33403 21.8539 1.19219 21.8367 1.15781C21.8109 1.11053 20.947 1.94865 18.4713 4.40714Z"
                              fill="white" />
                          <path
                              d="M4.41654 11.9674L1.08984 15.2726L1.32624 15.3542C1.55403 15.4316 1.82481 15.4359 10.9969 15.4359C20.1044 15.4359 20.4397 15.4316 20.6632 15.3542L20.891 15.2769L19.0084 13.3857C17.9683 12.3456 16.4683 10.8585 15.6689 10.0762L14.2204 8.65356L13.6273 9.2295C13.3049 9.54756 12.9224 9.88281 12.7849 9.97307C11.8909 10.5662 10.7347 10.6737 9.74613 10.261C9.30773 10.0762 9.00257 9.84842 8.37075 9.2338C8.0484 8.92434 7.77332 8.66646 7.76043 8.66646C7.75183 8.66646 6.24321 10.1536 4.41654 11.9674Z"
                              fill="white" />
                      </svg>
                  </a>
              </div>
          </footer>
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
