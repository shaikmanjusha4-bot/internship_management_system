require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');
const { seedDatabase } = require('./utils/seeder');

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const internshipRoutes = require('./routes/internshipRoutes');
const applicationRoutes = require('./routes/applicationRoutes');

// Initialize database connection and auto-seed if empty
connectDB().then(() => {
  seedDatabase().catch((err) => {
    console.error('Auto seed error on startup:', err.message);
  });
});

const app = express();

// Allowed origins for CORS (supports localhost, local IP, Vercel production & preview URLs, Render)
const allowedOrigins = [
  'https://internship-management-system-liart.vercel.app',
  'http://localhost:5173',
  'http://localhost:5000',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5000',
  'http://127.0.0.1:3000',
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (Postman, curl, server-to-server)
    if (!origin) return callback(null, true);

    const isAllowed =
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      origin.endsWith('.onrender.com') ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1');

    if (isAllowed) {
      return callback(null, true);
    }
    // Safe fallback for other frontends
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
  ],
  exposedHeaders: ['Authorization'],
};

// Middlewares
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

// API Base / Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Internship Management System API is healthy',
    timestamp: new Date().toISOString(),
  });
});

// Root URL status & navigation page
app.get('/', (req, res) => {
  if (req.headers.accept && req.headers.accept.includes('application/json')) {
    return res.status(200).json({
      status: 'OK',
      service: 'Internship Management System API',
      frontendUrl: 'https://internship-management-system-liart.vercel.app',
      endpoints: ['/api/health', '/api/internships', '/api/seed'],
    });
  }
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>IMS Backend API</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; }
        .card { background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 32px; max-width: 520px; width: 100%; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5); }
        .badge { display: inline-block; background: #10b981; color: #064e3b; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase; margin-bottom: 16px; }
        h1 { margin: 0 0 8px; font-size: 22px; color: #fff; }
        p { color: #94a3b8; font-size: 14px; line-height: 1.5; margin: 0 0 20px; }
        .btn { display: block; text-align: center; background: #4f46e5; color: #fff; text-decoration: none; padding: 12px 20px; border-radius: 10px; font-weight: 600; font-size: 14px; transition: background 0.2s; }
        .btn:hover { background: #4338ca; }
        .endpoints { margin-top: 24px; padding-top: 20px; border-top: 1px solid #334155; font-size: 13px; color: #cbd5e1; }
        .endpoints code { background: #0f172a; padding: 2px 6px; border-radius: 4px; color: #38bdf8; font-family: monospace; }
        .endpoints a { color: #818cf8; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="card">
        <span class="badge">● Backend Online</span>
        <h1>Internship Management System API</h1>
        <p>This is the backend REST API server. The complete interactive web application (Student & Admin portal) is hosted on Vercel.</p>
        <a class="btn" href="https://internship-management-system-liart.vercel.app" target="_blank">Open Web Application →</a>
        <div class="endpoints">
          <p style="margin-bottom: 8px;"><strong>API Endpoints:</strong></p>
          <ul style="padding-left: 20px; margin: 0; line-height: 1.8;">
            <li><code>GET</code> <a href="/api/health">/api/health</a> (Server Health)</li>
            <li><code>GET</code> <a href="/api/internships">/api/internships</a> (All Internships)</li>
            <li><code>GET</code> <a href="/api/seed">/api/seed</a> (Database Initialization)</li>
          </ul>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Seed endpoint for manual or remote initialization
app.get('/api/seed', async (req, res) => {
  try {
    const force = req.query.force === 'true';
    const result = await seedDatabase(force);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error('Seed endpoint error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/applications', applicationRoutes);

// Serve frontend in production if built dist exists (monolith mode)
const frontendDistPath = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get('*', (req, res) => {
    if (req.originalUrl.startsWith('/api')) {
      return res.status(404).json({
        success: false,
        message: `API Route not found: ${req.originalUrl}`,
      });
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
} else {
  // Catch-all 404 for undefined API routes
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      message: `API Route not found: ${req.originalUrl}`,
    });
  });
}

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack || err);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Backend server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
});

module.exports = app;
