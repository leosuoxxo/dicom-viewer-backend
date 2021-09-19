const generateTemplate = require('./definition_template.js');
const { successfulResponse, getErrorResponses, getRequestBody } = require('./factories/responseFactory');
const { 
  ID,
  AUTHENTICATION_CODE,
  NAME,
  CREATED_AT,
  UPDATED_AT,
  EXPIRED_AT,
  IS_PUBLISH,
  IS_DELETED,
  MACHINE_IDS,
 } = require('../../models/schemas/organization.schemas');
const {
  TIMESTAMP_SCHEMA,
  STRING_SCHEMA,
  BOOLEAN_SCHEMA,
  UUID_SCHEMA,
  ERROR_DESCRIPTION_SCHEMA,
  ARRAY_SCHEMA,
  convertSchemaToParameter,
} = require('../json-schemas/common.js');
const { MACHINE_IDS_SCHEMA } = require('../json-schemas/organization');

module.exports = generateTemplate({
  root: 'organization',
  paths: {
    '/': {
      get: {
        tags: [
          'Organization'
        ],
        summary: 'Get Organizations',
        security: [],
        parameters: [],
        responses: {
          '200': successfulResponse(ARRAY_SCHEMA({
            item: {
              '$ref': '#/components/schemas/Organization',
            }
          })),
          Error: getErrorResponses([1000, 1003]),
        }
      },
      post: {
        tags: [
          'Organization'
        ],
        summary: 'Create Organization',
        security: [],
        requestBody: getRequestBody({
          schema: {
              type: 'object',
              properties: {
                [NAME]: STRING_SCHEMA(),
                [EXPIRED_AT]: TIMESTAMP_SCHEMA(),
                [IS_PUBLISH]: BOOLEAN_SCHEMA(),
                [MACHINE_IDS]: MACHINE_IDS_SCHEMA(),
              },
              required: [
                NAME,
                EXPIRED_AT,
                IS_PUBLISH
              ],
          },
        }),
        responses: {
          '200': successfulResponse({
            '$ref': '#/components/schemas/Organization',
          }),
          Error: getErrorResponses([1000, 2002]),
        }
      },
    },
    '/{organizationId}': {
      get: {
        tags: [
          'Organization'
        ],
        summary: 'Get Organization By Id',
        security: [],
        parameters: [
          convertSchemaToParameter('organizationId', UUID_SCHEMA(), 'path', 'Organization Id'),
        ],
        responses: {
          '200': successfulResponse({
            '$ref': '#/components/schemas/Organization',
          }),
          Error: getErrorResponses([1000, 1003]),
        }
      },
      put: {
        tags: [
          'Organization'
        ],
        summary: 'Update Organization',
        security: [],
        parameters: [
          convertSchemaToParameter('organizationId', UUID_SCHEMA(), 'path', 'Organization Id'),
        ],
        requestBody: getRequestBody({
          schema: {
              type: 'object',
              properties: {
                [NAME]: STRING_SCHEMA(),
                [EXPIRED_AT]: TIMESTAMP_SCHEMA(),
                [IS_PUBLISH]: BOOLEAN_SCHEMA(),
                [MACHINE_IDS]: MACHINE_IDS_SCHEMA(),
              },
              required: [
                NAME,
                EXPIRED_AT,
                IS_PUBLISH
              ],
          },
        }),
        responses: {
          '200': successfulResponse({
            '$ref': '#/components/schemas/Organization',
          }),
          Error: getErrorResponses([1000, 2002]),
        }
      },
      delete:{
        tags: [
          'Organization'
        ],
        summary: 'Delete Organization',
        security: [],
        parameters: [
          convertSchemaToParameter('organizationId', UUID_SCHEMA(), 'path', 'Organization Id'),
        ],
        responses: {
          '200': successfulResponse({
            '$ref': '#/components/schemas/Organization',
          }),
          Error: getErrorResponses([1000, 2002]),
        }
      }
    },
    '/authenticate/{code}': {
      get: {
        tags: [
          'Authenticate'
        ],
        summary: 'authenticate code',
        security: [],
        parameters: [
          convertSchemaToParameter('code', UUID_SCHEMA(), 'path', 'authenticate code'),
        ],
        responses: {
          '200': successfulResponse({
            '$ref': '#/components/schemas/Organization',
          }),
          Error: getErrorResponses([1000, 1003, 2001, 2002]),
        }
      },
    },
    '/{organizationId}/code': {
      post: {
        tags: [
          'Organization'
        ],
        summary: 'Renew Code',
        security: [],
        parameters: [
          convertSchemaToParameter('organizationId', UUID_SCHEMA(), 'path', 'Organization Id'),
        ],
        responses: {
          '200': successfulResponse({
            '$ref': '#/components/schemas/Organization',
          }),
          Error: getErrorResponses([1000, 2002]),
        }
      },
    }
  },
  schemas: {
    Organization: {
      type: 'object',
      properties: {
        [ID]: UUID_SCHEMA(),
        [AUTHENTICATION_CODE]: UUID_SCHEMA(),
        [NAME]: STRING_SCHEMA([], '公司名稱'),
        [MACHINE_IDS]: MACHINE_IDS_SCHEMA(),
        [CREATED_AT]: TIMESTAMP_SCHEMA(),
        [UPDATED_AT]: TIMESTAMP_SCHEMA(),
        [EXPIRED_AT]: TIMESTAMP_SCHEMA(),
        [IS_PUBLISH]: BOOLEAN_SCHEMA(),
        [IS_DELETED]: BOOLEAN_SCHEMA(),
      }
    },
    Errors: ERROR_DESCRIPTION_SCHEMA([
      1000,
      1001,
      1002,
      1003,
      1004,
      2000,
      2001,
      2002
    ]),
  },
  tags: [
    { name: 'Organization' },
  ]
});
