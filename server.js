const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();
const FRONTEND_URL = process.env.FRONTEND_URL
const app = express();
app.use(cors({
    origin: FRONTEND_URL,
    methods: ["POST", "GET"],
    credentials: true
  }));
app.use(express.json());

app.post("/send-email", async (req, res) => {
  const { firstName, lastName, email, phone, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const adminMailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `New Contact Form Submission from ${firstName} ${lastName}`,
    html: `
      <div style="
        font-family: Arial, sans-serif;
        padding: 20px;
        border-radius: 12px;
        border: 3px solid #007bff;
        box-shadow: 8px 8px 20px rgba(0,0,0,0.2);
        background-color: #ffffff;
        max-width: 600px;
        margin: auto;
      ">
        <h2 style="color: #007bff; text-align: center;">📩 New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "Not Provided"}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="
          margin: 20px 0;
          padding: 15px;
          background-color: #f9f9f9;
          border-left: 4px solid #007bff;
          border-radius: 8px;
        ">
          ${message}
        </blockquote>
        <p style="text-align: center; color: #555;">📧 Please respond to this inquiry as soon as possible.</p>
      </div>
    `,
  };
  

  const userMailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Thank You for Contacting Me, ${firstName}!`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border-radius: 10px; border: 2px solid #4CAF50; box-shadow: 3px 3px 10px rgba(0,0,0,0.2);">
        <h2 style="color: #4CAF50;">Hello ${firstName},</h2>
        <p style="font-size:1.2rem;">Thank you for reaching out to me! I have received your message and will get back to you as soon as possible.</p>
        <p style="font-style: italic;">Here is a copy of your message:</p>
        <blockquote style="background-color: #f9f9f9; padding: 10px; border-left: 4px solid #4CAF50;">
          ${message}
        </blockquote>
        <p>Looking forward to connecting with you!</p>
        <p>Best Regards,</p>
        <p><strong>Kaushik Ranjan</strong></p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(userMailOptions);
    res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error occurred:", error.response || error.message || error);
    res.status(500).json({ message: "Failed to send message." });
  }
  
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
