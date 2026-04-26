/**
 * Main entry point for the backend server.
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
