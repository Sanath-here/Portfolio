import { MongoClient } from "mongodb";
import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";

let cachedClient = null;

async function getMongoClient() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return null;
  }

  if (cachedClient) {
    return cachedClient;
  }

  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 3000,
    connectTimeoutMS: 3000,
  });

  await client.connect();

  cachedClient = client;

  return client;
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  try {
    const { name, company, email, reason } = req.body || {};

    if (![name, company, email, reason].every((value) => typeof value === "string" && value.trim())) {
      return res.status(400).json({
        success: false,
        error: "All fields are required.",
      });
    }

    const cleanName = name.trim();
    const cleanCompany = company.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanReason = reason.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        error: "Invalid email address.",
      });
    }

    const resumeFilename = "SanathLalShibuLekhaResume.pdf";
    const resumePath = path.join(
      process.cwd(),
      "public",
      resumeFilename
    );
    const downloadUrl = `/${resumeFilename}`;
    const record = {
      name: cleanName,
      company: cleanCompany,
      email: cleanEmail,
      reason: cleanReason,
      createdAt: new Date(),
    };
    let recordId = `REQ-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    let dbSaved = false;

    try {
      const client = await getMongoClient();
      if (client) {
        const collection = client.db("portfolio").collection("resume_access_requests");
        const result = await collection.insertOne(record);
        recordId = `REQ-${result.insertedId.toString().slice(-8).toUpperCase()}`;
        dbSaved = true;
      } else {
        console.warn("Resume request was not saved: MONGODB_URI is not configured.");
      }
    } catch (error) {
      console.error("Failed to save resume request to MongoDB:", error);
    }

    let emailSent = false;
    let emailStatusMessage = "Email delivery is not configured; download the resume directly.";
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpHost && smtpUser && smtpPass) {
      try {
        const port = Number(process.env.SMTP_PORT) || 587;
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port,
          secure: port === 465,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        await transporter.sendMail({
          from: process.env.SMTP_FROM || `"Sanath Lal" <${smtpUser}>`,
          to: cleanEmail,
          subject: `Sanath Lal - Resume Dossier Request [${cleanCompany}]`,
          text: `Hello ${cleanName},

Thank you for your interest in my profile.
Please find my resume attached to this email.

Best regards,
Sanath Lal Shibu Lekha`,
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2>Hello ${escapeHtml(cleanName)},</h2>
              <p>Thank you for your interest in my profile.</p>
              <p>Please find my resume attached to this email.</p>
              <p>Best regards,<br><strong>Sanath Lal Shibu Lekha</strong></p>
            </div>
          `,
          attachments: fs.existsSync(resumePath)
            ? [{
                filename: resumeFilename,
                path: resumePath,
                contentType: "application/pdf",
              }]
            : [],
        });

        emailSent = true;
        emailStatusMessage = `Resume sent successfully to ${cleanEmail}.`;
      } catch (error) {
        console.error("Failed to send resume email:", error);
        emailStatusMessage = "Email delivery failed; download the resume directly.";
      }
    } else {
      console.warn("Resume email was not sent: SMTP credentials are not configured.");
    }

    return res.status(200).json({
      success: true,
      recordId,
      dbSaved,
      emailSent,
      emailStatusMessage,
      downloadUrl,
    });
  } catch (error) {
    console.error("Resume request error:", error);

    return res.status(500).json({
      success: false,
      error: "Unable to process your resume request. Please try again.",
    });
  }
}