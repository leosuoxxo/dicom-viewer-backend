const ERRORS = require('../routes/definitions/errors.js');

exports.success = data => ({
  status: 'success',
  data
});

exports.failure = (errorCode, message, infoData = {}) => {
  const error = ERRORS.find(v => v['errorCode'] === errorCode) || {};

  return {
    status: 'failure',
    error: {
      errorCode,
      description: error['description'] || '<placeholder>',
      message,
      ...infoData,
    }
  };
};
