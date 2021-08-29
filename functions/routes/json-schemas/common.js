const {
  shortId,
  removeUndefinedFromObject,
} = require('../../utils/helper.js');

const INTEGER_SCHEMA = ([minimum, maximum] = [], example) => {
  let schema = {
    type: 'integer',
  };
  if (typeof minimum !== 'undefined') schema['minimum'] = minimum;
  if (typeof maximum !== 'undefined') schema['maximum'] = maximum;
  if (typeof example !== 'undefined') schema['example'] = example;

  return schema;
};

const NUMBER_SCHEMA = ([minimum, maximum] = [], example) => {
  let schema = {
    type: 'number',
  };
  if (typeof minimum !== 'undefined') schema['minimum'] = minimum;
  if (typeof maximum !== 'undefined') schema['maximum'] = maximum;
  if (typeof example !== 'undefined') schema['example'] = example;

  return schema;
};

const BOOLEAN_SCHEMA = () => ({
  type: 'boolean',
});

const STRING_SCHEMA = ([minLength, maxLength] = [], example) => {
  let schema = {
    type: 'string',
  };
  if (typeof minLength !== 'undefined') schema['minLength'] = minLength;
  if (typeof maxLength !== 'undefined') schema['maxLength'] = maxLength;
  schema['example'] = example || '<string>';

  return schema;
};

const UUID_SCHEMA = () => ({
  type: 'string',
  pattern: '^[0-9a-f]{32}$',
  example: shortId(),
});

const TIMESTAMP_SCHEMA = () => ({
  type: 'integer',
  example: Date.now(),
});

const ARRAY_SCHEMA = ({ item, minItems, maxItems, uniqueItems = true }) => removeUndefinedFromObject({
  type: 'array',
  items: item,
  minItems,
  maxItems,
  uniqueItems,
});


const PAGINATION_SCHEMA = ({ DEFAULT_PAGE_SIZE = 10, MAX_PAGE_SIZE = 100 } = {}) => ({
  skip: {
    type: 'integer',
    minimum: 0,
    example: 0,
    description: 'Skip # Items'
  },
  limit: {
    type: 'integer',
    maximum: MAX_PAGE_SIZE,
    example: DEFAULT_PAGE_SIZE,
    description: 'Page Size',
  },
});

const PAGINATION_PARAMETERS = () => Object.entries(PAGINATION_SCHEMA()).map(([fieldName, schema]) => convertSchemaToParameter(fieldName, schema, 'query'));

const ERROR_DESCRIPTION_SCHEMA = (errorCodes) => {
  errorCodes = [...new Set(errorCodes)];
  errorCodes.sort((a, b) => a - b);
  const ERRORS = require('../definitions/errors.js');

  return {
    description: errorCodes.reduce((acc, v) => {
      const error = ERRORS.find(({ errorCode }) => errorCode === v);
      if (error) {
        const { errorCode, description } = error;
        acc += `|${errorCode}|${description}|\n`;
      }

      return acc;
    }, '|Error Code|Description|\n|-|-|\n'),
  };
};

function convertSchemaToParameter(fieldName, schema, parameterType, description, required) {
  const parameter = {
    name: fieldName,
    description: description || schema.description,
    in: parameterType,
    required: required || false,
  };
  if (schema.enum || schema.type === 'array') {
    parameter.schema = schema;
  } else {
    parameter.schema = { type: schema.type };
  }

  return parameter;
}

module.exports = {
  INTEGER_SCHEMA,
  NUMBER_SCHEMA,
  BOOLEAN_SCHEMA,
  STRING_SCHEMA,
  UUID_SCHEMA,
  TIMESTAMP_SCHEMA,
  ARRAY_SCHEMA,
  PAGINATION_SCHEMA,
  PAGINATION_PARAMETERS,
  ERROR_DESCRIPTION_SCHEMA,
  convertSchemaToParameter,
};
