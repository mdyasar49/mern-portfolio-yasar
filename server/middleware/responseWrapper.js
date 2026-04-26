/**
 * Middleware to wrap API responses in a standard format.
 */
const responseWrapper = (req, res, next) => {
  const originalJson = res.json;

  res.json = function (data) {
    if (data && typeof data === 'object' && !data.hasOwnProperty('success')) {
      const wrappedData = {
        success: true,
        payload: data,
        meta: {
          timestamp: new Date().toISOString(),
          path: req.originalUrl,
        },
      };
      return originalJson.call(this, wrappedData);
    }
    return originalJson.call(this, data);
  };

  next();
};

module.exports = responseWrapper;
