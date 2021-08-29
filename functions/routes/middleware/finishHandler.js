const logger = require("../../utils/logger");

module.exports = function(req, res, next) {
  res.on('finish', () => {
    if (req.error) {
      let errorMessage = `[${req.userId}][${req.method} ${req.url}] error: [${req.error.errorCode} - ${req.error.description}] ${req.error.message}`;
      if (req.error.infoData && Object.entries(req.error.infoData).length > 0) {
        errorMessage = `${errorMessage}, infoData: ${JSON.stringify(req.error.infoData, null, 2)}`;
      }
      logger.error(errorMessage);
      if ((req.method === 'POST' || req.method === 'PUT') && Object.entries(req.body).length > 0) {
        logger.error(`Request body: ${JSON.stringify(req.body, null, 2)}`);
      }
    }
  });
  next();
};
