const logger = require('../utils/logger');

/**
 * Validates environment variables at startup.
 */
const validateEnv = () => {
  // These vars are optional — server has fallbacks for all of them
  const optional = ['MONGO_URI', 'PORT', 'CLIENT_URL', 'CLIENT_URLS', 'NODE_ENV'];
  const missing = [];

  optional.forEach((variable) => {
    if (!process.env[variable]) {
      missing.push(variable);
    }
  });

  if (missing.length > 0) {
    logger.warn(`Missing optional environment variables: ${missing.join(', ')}`);
    logger.warn('Server will use default fallback values.');
  }

  // Validate MONGO_URI format only if it is provided
  if (process.env.MONGO_URI && !process.env.MONGO_URI.startsWith('mongodb')) {
    logger.warn('MONGO_URI does not look like a valid MongoDB connection string.');
  }

  logger.info('Environment check complete.');
};

module.exports = validateEnv;
