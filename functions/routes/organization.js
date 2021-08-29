const whitelist = [];

const app = require('./middleware/app.js')(whitelist, 'organization.js');
const jsonResult = require('../utils/jsonResult.js');
const { ERROR_CODE } = require('../constants.js');
const OrganizationController = require('../controllers/organization');
const OrganizationSchema = require('../models/schemas/organization.schemas');
const { ARRAY_SCHEMA, UUID_SCHEMA, STRING_SCHEMA, BOOLEAN_SCHEMA, PAGINATION_SCHEMA, TIMESTAMP_SCHEMA } = require('./json-schemas/common.js');
const { validator } = require('../utils/jsonSchemaValidator.js');
const { convertValidationErrorsToString } = require('../utils/helper');

app.get('/', (req, res) => {
  const { skip, limit } = req.query;
  const MAXIMUM = 100;
  const schema = {
    type: 'object',
    properties: {
      ...PAGINATION_SCHEMA(),
    },
  };

  const data = {
    skip: Number(skip) || 0,
    limit: Number(limit) || 10,
  };

  const validate = validator(schema);
  let result = null;
  if (!validate(data) || validate.errors) {
    result = jsonResult.failure(ERROR_CODE.COMMON.ValidationError, `Validation error ${convertValidationErrorsToString(validate.errors)}`);
  }

  if (result) {
    req.error = result.error;
    return res.send(result);
  }

  return OrganizationController.getOrganizations(data).then(([err, organizations]) => {
    if (err) {
      const result = jsonResult.failure(err, `Get organizations error`);
      req.error = result.error;
      return res.send(result);
    }
    return res.send(jsonResult.success(organizations));
  });
});

app.get('/:organizationId', (req, res) => {
  const { organizationId } = req.params;

  const data = {
    organizationId
  };

  const schema = {
    type: 'object',
    properties: {
      organizationId: UUID_SCHEMA(),
    },
  };

  const validate = validator(schema);
  let result = null;
  if (!validate(data) || validate.errors) {
    result = jsonResult.failure(ERROR_CODE.COMMON.ValidationError, `Validation error ${convertValidationErrorsToString(validate.errors)}`);
  }

  if (result) {
    req.error = result.error;
    return res.send(result);
  }


  return OrganizationController.getOrganizationById(organizationId).then(([err, organization]) => {
    if (err) {
      const result = jsonResult.failure(err, `Get Organization By Id error`);
      req.error = result.error;
      return res.send(result);
    }
    return res.send(jsonResult.success(organization));
  });

});

app.post('/', (req, res) => {
  // const { token, userId } = req;
  const {   
    taxIdNumber,
    name,
    contactPerson,
    expiredAt,
    isPublish, 
  } = req.body;

  const data = {
    // token,
    // userId,
    taxIdNumber,
    name,
    contactPerson,
    expiredAt,
    isPublish,
  };

  const schema = {
    type: 'object',
    properties: {
      taxIdNumber: STRING_SCHEMA(),
      name: STRING_SCHEMA(),
      contactPerson: STRING_SCHEMA(),
      expiredAt: TIMESTAMP_SCHEMA(),
      isPublish: BOOLEAN_SCHEMA()
    },
    required: ['name', 'expiredAt']
  };

  const validate = validator(schema);
  let result = null;
  if (!validate(data) || validate.errors) {
    result = jsonResult.failure(ERROR_CODE.COMMON.ValidationError, `Validation error ${convertValidationErrorsToString(validate.errors)}`);
  }

  if (result) {
    req.error = result.error;
    return res.send(result);
  }

  return OrganizationController.createOrganization(data).then(([err, organization]) => {
    if (err) {
      const result = jsonResult.failure(err, `create organization error`);
      req.error = result.error;
      return res.send(result);
    }
    return res.send(jsonResult.success(organization));
  });
});

app.put('/:organizationId', (req, res) => {
  const { organizationId } = req.params;
  const {   
    taxIdNumber,
    name,
    contactPerson,
    expiredAt,
    isPublish, 
  } = req.body;

  const data = {
    // token,
    // userId,
    organizationId,
    taxIdNumber,
    name,
    contactPerson,
    expiredAt,
    isPublish,
  };

  const schema = {
    type: 'object',
    properties: {
      organizationId: UUID_SCHEMA(),
      taxIdNumber: STRING_SCHEMA(),
      name: STRING_SCHEMA(),
      contactPerson: STRING_SCHEMA(),
      expiredAt: TIMESTAMP_SCHEMA(),
      isPublish: BOOLEAN_SCHEMA()
    },
  };

  const validate = validator(schema);
  let result = null;
  if (!validate(data) || validate.errors) {
    result = jsonResult.failure(ERROR_CODE.COMMON.ValidationError, `Validation error ${convertValidationErrorsToString(validate.errors)}`);
  }

  if (result) {
    req.error = result.error;
    return res.send(result);
  }

  return OrganizationController.updateOrganization(data).then(([err, organization]) => {
    if (err) {
      const result = jsonResult.failure(err, `update organization error`);
      req.error = result.error;
      return res.send(result);
    }
    return res.send(jsonResult.success(organization));
  });
});

app.delete('/:organizationId', (req, res) => {
  const { organizationId } = req.params;

  const data = {
    organizationId
  };

  const schema = {
    type: 'object',
    properties: {
      organizationId: UUID_SCHEMA(),
    },
  };

  const validate = validator(schema);
  let result = null;
  if (!validate(data) || validate.errors) {
    result = jsonResult.failure(ERROR_CODE.COMMON.ValidationError, `Validation error ${convertValidationErrorsToString(validate.errors)}`);
  }

  if (result) {
    req.error = result.error;
    return res.send(result);
  }


  return OrganizationController.deleteOrganization(organizationId).then(([err]) => {
    if (err) {
      const result = jsonResult.failure(err, `Delete Organization error`);
      req.error = result.error;
      return res.send(result);
    }
    return res.send(jsonResult.success());
  });
});

module.exports = app;