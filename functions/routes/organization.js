const whitelist = [];

const app = require('./middleware/app.js')(whitelist, 'organization.js');
const jsonResult = require('../utils/jsonResult.js');
const { ERROR_CODE } = require('../constants.js');
const OrganizationController = require('../controllers/organization');
const { UUID_SCHEMA, STRING_SCHEMA, BOOLEAN_SCHEMA, PAGINATION_SCHEMA, TIMESTAMP_SCHEMA } = require('./json-schemas/common.js');
const { MACHINE_IDS_SCHEMA } = require('./json-schemas/organization');
const { validator } = require('../utils/jsonSchemaValidator.js');
const { convertValidationErrorsToString } = require('../utils/helper');

app.get('/', (req, res) => {
  const { skip, limit, name } = req.query;
  const MAXIMUM = 100;
  const schema = {
    type: 'object',
    properties: {
      ...PAGINATION_SCHEMA(),
      name: STRING_SCHEMA(),
    },
  };

  const data = {
    name,
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
    name,
    expiredAt,
    isPublish,
    machineIds,
  } = req.body;

  const data = {
    // token,
    // userId,
    name,
    expiredAt,
    isPublish,
  };

  const schema = {
    type: 'object',
    properties: {
      name: STRING_SCHEMA(),
      expiredAt: TIMESTAMP_SCHEMA(),
      isPublish: BOOLEAN_SCHEMA(),
      machineIds: MACHINE_IDS_SCHEMA(),
    },
    required: ['name']
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
    name,
    expiredAt,
    isPublish,
    machineIds,
  } = req.body;

  const data = {
    // token,
    // userId,
    organizationId,
    name,
    expiredAt,
    isPublish,
    machineIds,
  };

  const schema = {
    type: 'object',
    properties: {
      organizationId: UUID_SCHEMA(),
      name: STRING_SCHEMA(),
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

app.get('/authenticate/:code', (req, res) => {
  const { code } = req.params;

  const data = {
    code
  };

  const schema = {
    type: 'object',
    properties: {
      code: STRING_SCHEMA(),
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


  return OrganizationController.authenticateCode(code).then(([err]) => {
    if (err) {
      const result = jsonResult.failure(err, `Authenticate code error`);
      req.error = result.error;
      return res.send(result);
    }
    return res.send(jsonResult.success());
  });

});


app.post('/:organizationId/code', (req, res) => {
  const { organizationId } = req.params;

  const data = {
    organizationId,
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

  return OrganizationController.renewCode(data).then(([err, organization]) => {
    if (err) {
      const result = jsonResult.failure(err, `renew code error`);
      req.error = result.error;
      return res.send(result);
    }
    return res.send(jsonResult.success(organization));
  });
});

module.exports = app;