import nodemailer from "nodemailer";

export default async function handler(req, res) {
  const { firstName, lastName, email, message } = req.body;

  // Create a transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: 'smtp.mail.us-east-1.awsapps.com', // Replace 'us-east-1' with your AWS region if different
    port: 465,
    secure: true, // Use SSL
    auth: {
      user: process.env.EMAIL_USER, // Your Amazon WorkMail email
      pass: process.env.MAIL_PERSONAL_ACCESS_TOKEN, // Use the token value here
    },
  });

  const fullName = `${firstName} ${lastName}`;

  const body = `${message}
${fullName},
${email}
`;

  // Set up email data
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender address
    to: process.env.EMAIL_USER, // List of recipients
    subject: `Message from ${fullName}`, // Subject line
    text: body, // Plain text body
  };

  try {
    // Send mail with defined transport object
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false });
  }
}
