const mongoose = require('mongoose');
const logger = require('../utils/logger');

/**
 * Connects to MongoDB with a timeout.
 */
const connectDB = async () => {
  try {
    // Strict 5s timeout to ensure fast fallback to JSON mode if DB is unreachable
    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      logger.warn('MONGO_URI not defined, using local data only.');
      return;
    }

    const conn = await mongoose.connect(mongoUri, options);
    logger.info(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    // Let the caller handle the fallback logic
    throw error;
  }
};

module.exports = connectDB;
