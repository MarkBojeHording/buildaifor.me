/**
 * Tier 2 Chatbot API Server
 * Main server entry point with Express setup, middleware, and route registration
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

// Import routes
const chatRoutes = require('./routes/chat');
const configRoutes = require('./routes/config');
const leadsRoutes = require('./routes/leads');

// Import middleware
// (Optional: add authentication, CORS, etc.)

const app = express();
const PORT = process.env.PORT || 8001;

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));

// API routes
app.use('/api/chat', chatRoutes);
app.use('/api/config', configRoutes);
app.use('/api/leads', leadsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Tier 2 Chatbot API Server',
    version: process.env.npm_package_version || '1.0.0',
    endpoints: {
      health: '/health',
      chat: '/api/chat',
      config: '/api/config',
      leads: '/api/leads',
    },
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Tier 2 Chatbot API Server running on port ${PORT}`);
});
