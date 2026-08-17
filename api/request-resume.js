import { MongoClient } from "mongodb";
import nodemailer from "nodemailer";
import path from "path";

let cachedClient = null;

async function getMongoClient() {
  if (cachedClient) {
    return cachedClient;
  }

  const client = new MongoClient(process.env.MONGODB_URI);

  await client.connect();

  cachedClient = client;

  return client;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  try {
    const { name, company, email, reason } = req.body;

    if (!name || !company || !email || !reason) {
      return res.status(400).json({
        success: false,
        error: "All fields are required.",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Invalid email address.",
      });
    }

    // Save request to MongoDB
    const client = await getMongoClient();

    const db = client.db("portfolio");
    const collection = db.collection("resume_requests");

    const result = await collection.insertOne({
      name: name.trim(),
      company: company.trim(),
      email: email.trim().toLowerCase(),
      reason: reason.trim(),
      createdAt: new Date(),
    });

    const recordId = result.insertedId.toString();

    // Configure Gmail SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Resume location
    const resumePath = path.join(
      process.cwd(),
      "public",
      "Sanath Lal Shibu Lekha Resume.pdf"
    );

    // Send resume
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,

      subject: "Sanath Lal - Resume",

      text: `Hello ${name},

Thank you for your interest in my profile.

Please find my resume attached to this email.

Best regards,
Sanath Lal Shibu Lekha,
Student, Game and Virtual Reality (VR) developer`,

      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Hello ${name},</h2>

          <p>
            Thank you for your interest in my profile.
          </p>
          <p>
            Please find my resume attached to this email.
          </p>
          <br>

          <p>
            Best regards,<br>
            <strong>Sanath Lal Shibu Lekha</strong><br>
            Student, Game and Virtual Reality (VR) developer
          </p>
        </div>
      `,

      attachments: [
        {
          filename: "Sanath_Lal_Resume.pdf",
          path: resumePath,
          contentType: "application/pdf",
        },
      ],
    });

    return res.status(200).json({
      success: true,
      recordId: `REQ-${recordId.slice(-8).toUpperCase()}`,
      emailSent: true,
      emailStatusMessage: `Resume sent successfully to ${email}.`,
      downloadUrl: "/Sanath_Lal_Resume.pdf",
    });
  } catch (error) {
    console.error("Resume request error:", error);

    return res.status(500).json({
      success: false,
      error: "Unable to process your resume request. Please try again.",
    });
  }
}