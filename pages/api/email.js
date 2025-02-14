import nodemailer from "nodemailer";

export default async (req, res) => {
  const { firstName, lastName, email, phone, notes } = req.body;

  // Create a transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    service: "gmail", // Use your email service
    auth: {
      user: process.env.EMAIL_USER, // Replace with your email
      pass: process.env.EMAIL_PASS, // Replace with your email password
    },
  });

  // Set up email data
  const mailOptions = {
    from: "nabilbelfki@gmail.com", // Sender address
    to: "nabilbelfki@gmail.com", // List of recipients
    subject: "New Meeting Request", // Subject line
    text: `Name: ${firstName} ${lastName}\nEmail: ${email}\nPhone: ${phone}\nNotes: ${notes}`, // Plain text body
  };

  try {
    // Send mail with defined transport object
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false });
  }
};
