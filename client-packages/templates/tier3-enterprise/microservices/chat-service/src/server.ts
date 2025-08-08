import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import winston from 'winston';
import { createClient } from 'redis';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { register } from 'prom-client';

// Import core services
import { ChatController } from './controllers/ChatController';
import { FileAnalysisController } from './controllers/FileAnalysisController';
import { AnalyticsController } from './controllers/AnalyticsController';
import { WorkflowController } from './controllers/WorkflowController';
import { SessionManager } from './services/SessionManager';
import { AIEngine } from './ai-engine/AIEngine';
import { AutomationEngine } from './services/AutomationEngine';
import { AnalyticsEngine } from './services/AnalyticsEngine';
import { WorkflowEngine } from './services/WorkflowEngine';

// Import middleware
import { authMiddleware } from '../middleware/auth';
import { rateLimitMiddleware } from '../middleware/rateLimit';
import { errorHandler } from '../middleware/errorHandler';
import { requestLogger } from '../middleware/requestLogger';

// Load environment variables
dotenv.config();

// Initialize logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'chat-service' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Initialize Redis client
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => logger.error('Redis Client Error', err));
redisClient.on('connect', () => logger.info('Redis Client Connected'));

// Initialize Express app
const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3001;

// Initialize Socket.IO for real-time communication
const io = new Server(server, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true
  }
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logging
app.use(requestLogger);

// Rate limiting
app.use('/api/', rateLimitMiddleware);

// Prometheus metrics endpoint
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'tier3-chat-service',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Initialize core services
const sessionManager = new SessionManager(redisClient);
const aiEngine = new AIEngine();
const automationEngine = new AutomationEngine();
const analyticsEngine = new AnalyticsEngine();
const workflowEngine = new WorkflowEngine();

// Initialize controllers
const chatController = new ChatController(sessionManager, aiEngine, automationEngine, analyticsEngine);
const fileAnalysisController = new FileAnalysisController(aiEngine);
const analyticsController = new AnalyticsController(analyticsEngine);
const workflowController = new WorkflowController(workflowEngine);

// API routes
app.use('/api/v1/chat', authMiddleware, chatController.router);
app.use('/api/v1/files', authMiddleware, fileAnalysisController.router);
app.use('/api/v1/analytics', authMiddleware, analyticsController.router);
app.use('/api/v1/workflows', authMiddleware, workflowController.router);

// Socket.IO connection handling
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);

  socket.on('join-session', (sessionId: string) => {
    socket.join(sessionId);
    logger.info(`Client ${socket.id} joined session: ${sessionId}`);
  });

  socket.on('leave-session', (sessionId: string) => {
    socket.leave(sessionId);
    logger.info(`Client ${socket.id} left session: ${sessionId}`);
  });

  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `The requested endpoint ${req.originalUrl} does not exist`,
    timestamp: new Date().toISOString()
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

// Start server
const startServer = async () => {
  try {
    await redisClient.connect();

    server.listen(PORT, () => {
      logger.info(`🚀 Enterprise Chat Service running on port ${PORT}`);
      logger.info(`📊 Metrics available at http://localhost:${PORT}/metrics`);
      logger.info(`🏥 Health check at http://localhost:${PORT}/health`);
      logger.info(`🔌 Socket.IO server ready for real-time communication`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
