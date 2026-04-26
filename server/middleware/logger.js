const winstonLogger = require('../utils/logger');

const logger = (req, res, next) => {
  const start = Date.now();

  // Intercept the finish event to calculate final latency
  res.on('finish', () => {
    const duration = Date.now() - start;
    const timestamp = new Date().toLocaleTimeString();
    const method = req.method.padEnd(7);
    const status = res.statusCode;

    // Choose icon based on status
    let statusIcon = '✓';
    if (status >= 400) statusIcon = '⚠';
    if (status >= 500) statusIcon = '✘';

    winstonLogger.info(
      `[${timestamp}] ${statusIcon} ${method} | ${status} | ${duration.toString().padStart(3)}ms | ${req.originalUrl}`
    );
  });

  next();
};

module.exports = logger;
