require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/database');
const config = require('./config');
const routes = require('./routes');

const app = express();

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: config.RATE_LIMIT.WINDOW_MS,
  max: config.RATE_LIMIT.MAX_REQUESTS,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later'
  }
});
app.use('/api', limiter);

// Compression middleware
app.use(compression());

// CORS
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (config.NODE_ENV !== 'test') {
  app.use(morgan(config.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// API routes
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Backend API is running!',
    version: '1.0.0',
    environment: config.NODE_ENV,
    endpoints: {
      'GET /api/health': 'Health check',
      'POST /api/auth/register': 'Register a new user',
      'POST /api/auth/login': 'Login user',
      'POST /api/auth/refresh-token': 'Refresh access token',
      'POST /api/auth/logout': 'Logout user (requires auth)',
      'GET /api/auth/profile': 'Get user profile (requires auth)',
      'PUT /api/auth/profile': 'Update user profile (requires auth)',
      'POST /api/auth/change-password': 'Change password (requires auth)',
      'POST /api/auth/deactivate': 'Deactivate account (requires auth)'
    }
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: Object.values(error.errors).map(err => err.message)
    });
  }
  
  if (error.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate field value'
    });
  }
  
  res.status(500).json({
    success: false,
    message: config.NODE_ENV === 'production' ? 'Internal server error' : error.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = config.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${config.NODE_ENV}`);
  console.log(`📁 Database: ${config.MONGODB_URI?.split('@')[1] || 'MongoDB'}`);
});

module.exports = app;