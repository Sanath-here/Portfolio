import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const app = express();

app.use(express.json());

// In-memory fallback arrays if MongoDB is not connected
const fallbackLogs: Array<{
  id: string;
  name: string;
  company: string;
  email: string;
  reason: string;
  timestamp: string;
  emailSent: boolean;
  dbSaved: boolean;
}> = [];

const fallbackFeedback: Array<{
  id: string;
  author: string;
  email: string;
  role: string;
  subject: string;
  rating: number;
  message: string;
  date: string;
  timestamp: string;
  dbSaved: boolean;
}> = [];

// Helper to get or connect to MongoDB lazily
let mongoClient: MongoClient | null = null;

async function getMongoCollection(collectionName: string = 'resume_access_requests') {
  const uri = process.env.MONGODB_URI;
  if (!uri) return null;

  try {
    if (!mongoClient) {
      mongoClient = new MongoClient(uri);
      await mongoClient.connect();
      console.log('Successfully connected to MongoDB');
    }
    const db = mongoClient.db('portfolio');
    return db.collection(collectionName);
  } catch (err) {
    console.error('MongoDB connection error:', err);
    mongoClient = null;
    return null;
  }
}

// POST /api/request-resume
app.post('/api/request-resume', async (req, res) => {
  try {
    const { name, company, email, reason } = req.body || {};

    if (!name || !company || !email || !reason) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields. Name, Company, Email, and Reason are required.',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email address provided.',
      });
    }

    let emailSent = false;
    let emailStatusMessage = '';

    // 1. Attempt Email Delivery via Nodemailer if SMTP is configured
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    const resumePath = path.join(process.cwd(), 'public', 'Sanath_Lal_Resume.pdf');

    if (smtpHost && smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: Number(process.env.SMTP_PORT) === 465,
          auth: { user: smtpUser, pass: smtpPass },
        });

        const attachments = fs.existsSync(resumePath)
          ? [{ filename: 'Sanath_Lal_Resume.pdf', path: resumePath }]
          : [];

        await transporter.sendMail({
          from: process.env.SMTP_FROM || `"Sanath Lal" <${smtpUser}>`,
          to: email,
          subject: `Sanath Lal - Resume Dossier Request [${company}]`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0b0e17; color: #e2e8f0; padding: 24px; border-radius: 8px; border: 1px solid #1e293b;">
              <h2 style="color: #c4fd02; margin-top: 0;">Access Request Granted</h2>
              <p>Hi <strong>${name}</strong>,</p>
              <p>Thank you for reaching out regarding my resume for <strong>${company}</strong>.</p>
              <p style="background-color: #161f30; padding: 12px; border-left: 3px solid #c4fd02; font-style: italic;">
                "Reason provided: ${reason}"
              </p>
              <p>Please find my official resume attached to this email.</p>
              <br/>
              <p style="color: #94a3b8; font-size: 13px;">Best regards,<br/><strong>Sanath Lal</strong></p>
            </div>
          `,
          attachments,
        });

        emailSent = true;
        emailStatusMessage = 'Resume dispatched to your email address.';
      } catch (mailErr) {
        console.error('Failed to send email via SMTP:', mailErr);
        emailSent = false;
        emailStatusMessage = 'SMTP error during email dispatch. direct download activated.';
      }
    } else {
      emailStatusMessage = 'Email dispatch simulated (SMTP server credentials not configured in environment).';
    }

    // 2. Save Request Log to MongoDB or fallback
    let dbSaved = false;
    const requestLog = {
      id: `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      name: String(name).trim(),
      company: String(company).trim(),
      email: String(email).trim().toLowerCase(),
      reason: String(reason).trim(),
      timestamp: new Date().toISOString(),
      ip: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1',
      userAgent: req.get('user-agent') || 'Unknown',
      emailSent,
    };

    const collection = await getMongoCollection();
    if (collection) {
      try {
        await collection.insertOne(requestLog);
        dbSaved = true;
      } catch (dbErr) {
        console.error('Failed to insert log into MongoDB:', dbErr);
      }
    }

    if (!dbSaved) {
      fallbackLogs.unshift({ ...requestLog, dbSaved: false });
    }

    return res.status(200).json({
      success: true,
      message: 'Request logged successfully.',
      emailSent,
      emailStatusMessage,
      dbSaved,
      downloadUrl: '/Sanath_Lal_Resume.pdf',
      recordId: requestLog.id,
    });
  } catch (error) {
    console.error('Error handling resume request:', error);
    return res.status(500).json({
      success: false,
      error: 'An internal error occurred while processing your request.',
    });
  }
});

// GET /api/resume-requests (For auditing logged requests)
app.get('/api/resume-requests', async (req, res) => {
  try {
    const collection = await getMongoCollection('resume_access_requests');
    if (collection) {
      const docs = await collection.find({}).sort({ timestamp: -1 }).limit(50).toArray();
      return res.json({ source: 'mongodb', count: docs.length, data: docs });
    }
    return res.json({ source: 'memory_fallback', count: fallbackLogs.length, data: fallbackLogs });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve access requests.' });
  }
});

// POST /api/feedback (Submit contact feedback & store in MongoDB)
app.post('/api/feedback', async (req, res) => {
  try {
    const { name, email, role, subject, rating, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and message are required fields.',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email address provided.',
      });
    }

    const numericRating = Math.max(1, Math.min(5, Number(rating) || 5));
    const nowISO = new Date().toISOString();
    const dateStr = nowISO.split('T')[0];

    const feedbackEntry = {
      id: `fb-usr-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      author: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      role: role ? String(role).trim() : 'Portfolio Visitor',
      subject: subject ? String(subject).trim() : 'General Feedback',
      rating: numericRating,
      message: String(message).trim(),
      date: dateStr,
      timestamp: nowISO,
      ip: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1',
    };

    let dbSaved = false;
    const collection = await getMongoCollection('feedback_entries');

    if (collection) {
      try {
        await collection.insertOne(feedbackEntry);
        dbSaved = true;
      } catch (dbErr) {
        console.error('Failed to insert feedback into MongoDB:', dbErr);
      }
    }

    if (!dbSaved) {
      fallbackFeedback.unshift({ ...feedbackEntry, dbSaved: false });
    }

    // Optional SMTP dispatch notification to owner
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpHost && smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: Number(process.env.SMTP_PORT) === 465,
          auth: { user: smtpUser, pass: smtpPass },
        });

        await transporter.sendMail({
          from: process.env.SMTP_FROM || `"Portfolio Commlink" <${smtpUser}>`,
          to: process.env.SMTP_FROM || smtpUser,
          subject: `[New Portfolio Feedback] ${feedbackEntry.subject} - ${feedbackEntry.author}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0b0e17; color: #e2e8f0; padding: 24px; border-radius: 8px;">
              <h2 style="color: #c4fd02; margin-top: 0;">New Feedback Received</h2>
              <p><strong>From:</strong> ${feedbackEntry.author} (${feedbackEntry.email})</p>
              <p><strong>Role/Organization:</strong> ${feedbackEntry.role}</p>
              <p><strong>Rating:</strong> ${feedbackEntry.rating} / 5 Stars</p>
              <p><strong>Subject:</strong> ${feedbackEntry.subject}</p>
              <div style="background-color: #161f30; padding: 16px; border-left: 4px solid #c4fd02; margin: 16px 0;">
                "${feedbackEntry.message}"
              </div>
              <p style="color: #94a3b8; font-size: 12px;">Submitted on ${feedbackEntry.timestamp}</p>
            </div>
          `,
        });
      } catch (mailErr) {
        console.error('Failed to dispatch feedback email:', mailErr);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Feedback received and saved to database.',
      dbSaved,
      data: feedbackEntry,
    });
  } catch (error) {
    console.error('Error handling feedback submission:', error);
    return res.status(500).json({
      success: false,
      error: 'An internal server error occurred while processing feedback.',
    });
  }
});

// GET /api/feedback (Retrieve stored feedback list from MongoDB)
app.get('/api/feedback', async (req, res) => {
  try {
    const collection = await getMongoCollection('feedback_entries');
    if (collection) {
      const docs = await collection.find({}).sort({ timestamp: -1 }).limit(100).toArray();
      // Format mongodb _id out if needed
      const sanitized = docs.map(doc => ({
        id: doc.id || String(doc._id),
        author: doc.author,
        email: doc.email,
        role: doc.role,
        subject: doc.subject,
        rating: doc.rating,
        message: doc.message,
        date: doc.date || (doc.timestamp ? doc.timestamp.split('T')[0] : '2026-08-08'),
      }));
      return res.json({ success: true, source: 'mongodb', count: sanitized.length, data: sanitized });
    }
    return res.json({ success: true, source: 'memory_fallback', count: fallbackFeedback.length, data: fallbackFeedback });
  } catch (err) {
    console.error('Error fetching feedback from database:', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve feedback list.' });
  }
});

// DELETE /api/feedback/:id (Delete feedback entry)
app.delete('/api/feedback/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ success: false, error: 'Feedback ID is required.' });

    const collection = await getMongoCollection('feedback_entries');
    if (collection) {
      await collection.deleteOne({ id });
    }

    const index = fallbackFeedback.findIndex(item => item.id === id);
    if (index !== -1) {
      fallbackFeedback.splice(index, 1);
    }

    return res.json({ success: true, message: `Feedback ${id} deleted.` });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to delete feedback entry.' });
  }
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
