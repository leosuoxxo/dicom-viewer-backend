const { STRING_SCHEMA, INTEGER_SCHEMA } = require("../../json-schemas/common");

const ERRORS = require('../errors.js');

function successfulResponse(data) {
  return {
    description: 'OK',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            status: STRING_SCHEMA([], 'success'),
            data
          },
        }
      }
    }
  };
}

function failureResponse({ message, errorCode, data }) {
  return {
    description: message,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            status: STRING_SCHEMA([], 'failure'),
            error: {
              type: 'object',
              properties: {
                errorCode: INTEGER_SCHEMA([], errorCode),
                message: STRING_SCHEMA([], message),
                ...data
              }
            },
          },
        }
      }
    }
  };
}

function getRequestBody({ schema }) {
  return { content: { 'application/json': { schema } } };
}

function getErrorResponses(errorCodes) {
  errorCodes.sort((a, b) => a - b);
  let maxDescriptionLength = 'description'.length;
  let responses = errorCodes.reduce((acc, v) => {
    const error = ERRORS.find(({ errorCode }) => errorCode === v);
    if (error) {
      const { errorCode, description } = error;
      maxDescriptionLength = Math.max(maxDescriptionLength, description.length);

      acc.push({ errorCode, description });
    }

    return acc;
  }, []);

  function line(errorCode, description) {
    return `${errorCode.padStart(10)} | ${description.padEnd(maxDescriptionLength)}`;
  }

  return {
    description: 'Error Handling',
    content: {
      'text/plain': {
        schema: STRING_SCHEMA([], responses.reduce((acc, { errorCode, description }) => {
          acc += `\r\n${line(String(errorCode), description)}`;
          return acc;
        }, line('Error Code', 'Description'))),
      },
    }
  };
}

module.exports = {
  successfulResponse,
  failureResponse,
  getRequestBody,
  getErrorResponses,
};
