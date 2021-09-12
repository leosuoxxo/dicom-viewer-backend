const { ERROR_CODE } = require('../../../constants');

module.exports = [
  { errorCode: ERROR_CODE.ORGANIZATION.IDisRequired, description: 'id is required' },
  { errorCode: ERROR_CODE.ORGANIZATION.NotExist, description: 'organization is not exist' },
  { errorCode: ERROR_CODE.ORGANIZATION.Expired, description: 'authenticationCode is expired' },
  { errorCode: ERROR_CODE.ORGANIZATION.NotActivated, description: 'organization is not Activated' },
];
