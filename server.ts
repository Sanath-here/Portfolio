import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();
const envExamplePath = path.join(process.cwd(), '.env.example');
const envLocalPath = path.join(process.cwd(), '.env.local');
const envPath = path.join(process.cwd(), '.env');

if (fs.existsSync(envExamplePath)) dotenv.config({ path: envExamplePath });
if (fs.existsSync(envLocalPath)) dotenv.config({ path: envLocalPath });
if (fs.existsSync(envPath)) dotenv.config({ path: envPath });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const app = express();

app.use(express.json());

// In-memory fallback arrays with file persistence if MongoDB is not connected
const FALLBACK_FILE = path.join(__dirname, 'data_feedback_fallback.json');

function loadFallbackFeedbackFromFile(): Array<any> {
  try {
    if (fs.existsSync(FALLBACK_FILE)) {
      const raw = fs.readFileSync(FALLBACK_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Failed to load fallback feedback file:', e);
  }
  return [];
}

function saveFallbackFeedbackToFile(list: Array<any>) {
  try {
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to save fallback feedback file:', e);
  }
}

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
}> = loadFallbackFeedbackFromFile();

// Helper to get or connect to MongoDB lazily
let mongoClient: MongoClient | null = null;

async function getMongoCollection(collectionName: string = 'resume_access_requests') {
  const uri = process.env.MONGODB_URI;
  if (!uri || !uri.trim()) return null;

  try {
    if (!mongoClient) {
      mongoClient = new MongoClient(uri, {
        serverSelectionTimeoutMS: 3000,
        connectTimeoutMS: 3000,
      });
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

    const forwardedHeader = req.headers['x-forwarded-for'];
    const clientIp = Array.isArray(forwardedHeader) 
      ? forwardedHeader[0] 
      : (typeof forwardedHeader === 'string' ? forwardedHeader.split(',')[0].trim() : req.ip || '127.0.0.1');

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
      ip: clientIp,
    };

    let dbSaved = false;
    let collection = null;
    try {
      collection = await getMongoCollection('feedback_entries');
    } catch (e) {
      console.error('Error fetching MongoDB collection:', e);
    }

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
      saveFallbackFeedbackToFile(fallbackFeedback);
    }

    // Automated server-side email dispatch
    const smtpHost = process.env.SMTP_HOST?.trim();
    const smtpUser = process.env.SMTP_USER?.trim();
    const smtpPass = process.env.SMTP_PASS?.trim();
    const smtpPort = Number(process.env.SMTP_PORT) || 587;

    let emailDispatched = false;
    let emailStatusNotice = '';

    if (smtpHost && smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: { user: smtpUser, pass: smtpPass },
          tls: { rejectUnauthorized: false },
          connectionTimeout: 10000,
          greetingTimeout: 5000,
        });

        const targetEmail = process.env.SMTP_TO?.trim() || process.env.SMTP_FROM?.trim() || 'sanath.lal2023@gmail.com';
        const fallbackFrom = process.env.SMTP_FROM?.trim() || `"${feedbackEntry.author} (${feedbackEntry.email})" <${smtpUser}>`;
        
        // Attempt 1: Send directly using the visitor's name & email as the FROM address
        const visitorFrom = `"${feedbackEntry.author}" <${feedbackEntry.email}>`;

        const mailPayload = {
          to: targetEmail,
          replyTo: `"${feedbackEntry.author}" <${feedbackEntry.email}>`,
          subject: `[Portfolio Feedback] ${feedbackEntry.subject} - From ${feedbackEntry.author}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0b0e17; color: #e2e8f0; padding: 24px; border-radius: 8px; border: 1px solid #1e293b;">
              <h2 style="color: #c4fd02; margin-top: 0;">New Transmission Received</h2>
              <p><strong>Visitor Name:</strong> ${feedbackEntry.author}</p>
              <p><strong>Visitor Email:</strong> <a href="mailto:${feedbackEntry.email}" style="color: #c4fd02;">${feedbackEntry.email}</a></p>
              <p><strong>Role/Company:</strong> ${feedbackEntry.role || 'N/A'}</p>
              <p><strong>Rating:</strong> ${feedbackEntry.rating} / 5 Stars</p>
              <p><strong>Subject:</strong> ${feedbackEntry.subject}</p>
              <div style="background-color: #161f30; padding: 16px; border-left: 4px solid #c4fd02; margin: 16px 0; font-style: italic;">
                "${feedbackEntry.message}"
              </div>
              <p style="color: #94a3b8; font-size: 12px;">Submitted at ${feedbackEntry.timestamp} from IP ${clientIp}</p>
            </div>
          `,
        };

        try {
          // Try sending directly with visitor email as From
          await transporter.sendMail({
            from: visitorFrom,
            ...mailPayload
          });
          emailDispatched = true;
          emailStatusNotice = `Email dispatched directly from ${feedbackEntry.email} to ${targetEmail}`;
        } catch (visitorSenderErr: any) {
          console.warn('SMTP rejected direct visitor FROM address (common with Gmail/Outlook DMARC policies). Falling back to authenticated sender:', visitorSenderErr?.message);
          
          // Fallback Attempt: Use authenticated sender with visitor's name & email in display name
          await transporter.sendMail({
            from: `"${feedbackEntry.author} (${feedbackEntry.email})" <${smtpUser}>`,
            ...mailPayload
          });
          emailDispatched = true;
          emailStatusNotice = `Email dispatched to ${targetEmail} (Formatted From: ${feedbackEntry.author} <${feedbackEntry.email}>)`;
        }
      } catch (mailErr: any) {
        console.error('Failed to dispatch feedback email via SMTP:', mailErr);
        emailStatusNotice = `SMTP Error (${mailErr?.code || 'FAIL'}): ${mailErr?.message || 'Check App Password or SMTP credentials'}`;
      }
    } else {
      const missingVars = [];
      if (!smtpHost) missingVars.push('SMTP_HOST');
      if (!smtpUser) missingVars.push('SMTP_USER');
      if (!smtpPass) missingVars.push('SMTP_PASS');
      console.log(`[Email Notice] Missing SMTP configuration: ${missingVars.join(', ')}.`);
      emailStatusNotice = `Missing environment variables: ${missingVars.join(', ')}. Set them in .env / platform variables.`;
    }

    return res.status(200).json({
      success: true,
      message: 'Feedback received and processed.',
      dbSaved,
      emailDispatched,
      emailNotice: emailStatusNotice,
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

// GET /api/smtp-test (Diagnostic endpoint to verify SMTP configuration)
app.get('/api/smtp-test', async (req, res) => {
  const smtpHost = process.env.SMTP_HOST?.trim();
  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPass = process.env.SMTP_PASS?.trim();
  const smtpPort = Number(process.env.SMTP_PORT) || 587;

  if (!smtpHost || !smtpUser || !smtpPass) {
    const missingVars = [];
    if (!smtpHost) missingVars.push('SMTP_HOST');
    if (!smtpUser) missingVars.push('SMTP_USER');
    if (!smtpPass) missingVars.push('SMTP_PASS');
    return res.status(200).json({
      configured: false,
      verified: false,
      missing: {
        SMTP_HOST: !smtpHost,
        SMTP_USER: !smtpUser,
        SMTP_PASS: !smtpPass,
      },
      message: `SMTP variables missing in server environment: ${missingVars.join(', ')}. Configure them in project Settings/Environment Variables.`,
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
      tls: { rejectUnauthorized: false },
      connectionTimeout: 10000,
    });

    await transporter.verify();
    return res.status(200).json({
      configured: true,
      verified: true,
      host: smtpHost,
      user: smtpUser,
      port: smtpPort,
      message: `SMTP connection to ${smtpHost}:${smtpPort} verified successfully for ${smtpUser}!`,
    });
  } catch (err: any) {
    return res.status(200).json({
      configured: true,
      verified: false,
      host: smtpHost,
      user: smtpUser,
      port: smtpPort,
      message: `SMTP Authentication Error (${err?.code || 'AUTH_FAIL'}): ${err?.message || 'Failed to authenticate with SMTP server. Please check your App Password.'}`,
      error: err?.message || 'Failed to authenticate with SMTP server',
      code: err?.code,
    });
  }
});

// GET /api/feedback (Retrieve stored feedback list from MongoDB or file fallback)
app.get('/api/feedback', async (req, res) => {
  try {
    const collection = await getMongoCollection('feedback_entries');
    if (collection) {
      const docs = await collection.find({}).sort({ timestamp: -1 }).limit(100).toArray();
      const sanitized = docs.map(doc => ({
        id: doc.id || String(doc._id),
        author: doc.author,
        role: doc.role,
        subject: doc.subject,
        rating: doc.rating,
        message: doc.message,
        date: doc.date || (doc.timestamp ? doc.timestamp.split('T')[0] : '2026-08-08'),
      }));
      return res.json({ success: true, source: 'mongodb', count: sanitized.length, data: sanitized });
    }
    const diskFallback = loadFallbackFeedbackFromFile();
    const sanitizedFallback = diskFallback.map(doc => ({
      id: doc.id,
      author: doc.author,
      role: doc.role,
      subject: doc.subject,
      rating: doc.rating,
      message: doc.message,
      date: doc.date,
    }));
    return res.json({ success: true, source: 'disk_fallback', count: sanitizedFallback.length, data: sanitizedFallback });
  } catch (err) {
    console.error('Error fetching feedback from database:', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve feedback list.' });
  }
});

// DELETE /api/feedback/:id (Delete feedback entry - Protected for Portfolio Owner)
app.delete('/api/feedback/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const providedKey = req.headers['x-admin-key'] || req.query.adminKey || (req.body && req.body.adminKey);
    const requiredKey = process.env.ADMIN_SECRET_KEY || 'sanath2026';

    if (!providedKey || String(providedKey).trim() !== String(requiredKey).trim()) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized: Only the portfolio owner can delete feedback entries.',
      });
    }

    if (!id) return res.status(400).json({ success: false, error: 'Feedback ID is required.' });

    const collection = await getMongoCollection('feedback_entries');
    if (collection) {
      await collection.deleteOne({ id });
    }

    const index = fallbackFeedback.findIndex(item => item.id === id);
    if (index !== -1) {
      fallbackFeedback.splice(index, 1);
      saveFallbackFeedbackToFile(fallbackFeedback);
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
