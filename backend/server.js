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
