const ERROR_CODE = {
  COMMON: {
    InternalError: 1000,
    PermissionDenied: 1001,
    InvalidToken: 1002,
    ValidationError: 1003,
    AlreadyExists: 1004,
  },
  ORGANIZATION: {
    IDisRequired: 2000,
    NotExist: 2001,
  }
};

const PATTERN = {
  UUID: '^[0-9a-f]{32}$',
  POSITIVE_NUMBER: '^[1-9]\\d*$',
};

module.exports = {
  ERROR_CODE,
  PATTERN,
};
