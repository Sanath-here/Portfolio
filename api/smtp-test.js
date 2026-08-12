import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      configured: false,
      verified: false,
      message: "Method not allowed",
    });
  }

  try {
    const requiredVariables = {
      SMTP_HOST: process.env.SMTP_HOST,
      SMTP_PORT: process.env.SMTP_PORT,
      SMTP_USER: process.env.SMTP_USER,
      SMTP_PASS: process.env.SMTP_PASS,
      SMTP_FROM: process.env.SMTP_FROM,
    };

    const missing = {};

    for (const [key, value] of Object.entries(requiredVariables)) {
      missing[key] = !value;
    }

    const hasMissingVariables = Object.values(missing).some(Boolean);

    if (hasMissingVariables) {
      return res.status(200).json({
        configured: false,
        verified: false,
        message: "SMTP configuration is incomplete.",
        missing,
      });
    }

    const port = Number(process.env.SMTP_PORT);

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.verify();

    return res.status(200).json({
      configured: true,
      verified: true,
      message: "SMTP connection verified successfully. Email service is ready.",
      host: process.env.SMTP_HOST,
      port,
      user: process.env.SMTP_USER,
    });
  } catch (error) {
    console.error("SMTP diagnostic error:", error);

    return res.status(200).json({
      configured: true,
      verified: false,
      message:
        error?.message ||
        "SMTP connection could not be verified.",
      host: process.env.SMTP_HOST || null,
      port: process.env.SMTP_PORT
        ? Number(process.env.SMTP_PORT)
        : null,
      user: process.env.SMTP_USER || null,
    });
  }
}