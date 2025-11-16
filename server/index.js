// CareCompass AI Backend Server
// Task 2.1: Main server entry point

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

// Task 3.9: Import triage router
import triageRouter from './routes/triage.js';

// Task 2.1: Configure dotenv at top of file
dotenv.config();

// Task 2.1: Create Express app instance
const app = express();

// Task 2.1: Set PORT from env or default 3001
const PORT = process.env.PORT || 3001;

// Task 2.2: Configure security middleware
// Add helmet() for security headers
app.use(helmet());

// Task 8.7: Configure backend CORS for frontend
// Set CORS origin to frontend URL (localhost:5173 for Vite)
// Allow necessary headers
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Add express.json() with 10MB limit for images
app.use(express.json({ limit: '10mb' }));

// Add morgan('dev') for request logging
app.use(morgan('dev'));

// Task 2.3: Add rate limiting middleware
// Configure: 10 requests per minute per IP
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests, please try again in a minute.'
  }
});

// Apply to /api routes
app.use('/api', apiLimiter);

// Task 2.4: Create health check endpoint
// GET /api/health
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Task 3.9: Mount router in main server
app.use('/api/triage', triageRouter);

// Task 2.5: Add error handling middleware
// Global error handler at end of middleware chain
app.use((err, req, res, next) => {
  // Log errors to console
  console.error('Server Error:', err.message);

  // Never expose stack traces in production
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  // Return user-friendly error messages
  res.status(err.status || 500).json({
    error: err.message || 'An unexpected error occurred',
    ...(process.env.NODE_ENV === 'development' && { details: err.stack })
  });
});

// Task 2.6: Start server and verify
app.listen(PORT, () => {
  console.log(`CareCompass AI Server running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/api/health`);
  console.log(`Triage endpoint available at http://localhost:${PORT}/api/triage/analyze`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});

export default app;
