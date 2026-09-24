require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const internshipRoutes = require('./routes/internshipRoutes');
const applicationRoutes = require('./routes/applicationRoutes');

// Initialize database connection
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// API Base / Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Internship Management System API is healthy',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/applications', applicationRoutes);

// Serve frontend in production if built dist exists
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
