/**
 * Main entry point for the backend server with WebSocket Data Engine.
 */

require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');
const validateEnv = require('./config/envValidator');
const http = require('http');
const logger = require('./utils/logger');

// Check environment variables
validateEnv();

const PORT = process.env.PORT || 5001;
// Create an HTTP server instance using the Express 'app'
const server = http.createServer(app);

// Initialize Socket.io with permissive CORS & dual transports
const { Server } = require('socket.io');

const io = new Server(server, {
  cors: {
    origin: true, // Allow all valid web & mobile origins dynamically
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Attach io to app for access in controllers
app.set('io', io);

io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);

  // High-performance WebSocket profile data delivery
  socket.on('requestProfile', () => {
    try {
      const dataDir = require('path').join(__dirname, 'data');
      const fs = require('fs');
      const basicPath = require('path').join(dataDir, 'basic_info.json');
      if (fs.existsSync(basicPath)) {
        const basic = JSON.parse(fs.readFileSync(basicPath, 'utf-8'));
        socket.emit('profileData', basic);
      }
    } catch (err) {
      logger.error('WebSocket profile emit error:', err);
    }
  });

  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

/**
 * Start the server and connect to DB.
 */
const startServer = async () => {
  try {
    await connectDB();
  } catch (error) {
    logger.warn('MongoDB could not start. Using local data backup.');
  } finally {
    server.listen(PORT, '0.0.0.0', () => {
      logger.info(`🚀 Server running on port ${PORT}`);
    });
  }
};

// Handle unhandled rejections to prevent silent crashes
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
});

startServer();
