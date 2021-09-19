const { ERROR_CODE } = require('../constants.js');
const OrganizationModel = require('../models/organization');
const OrganizationSchema = require('../models/schemas/organization.schemas')
const { shortId } = require('../utils/helper');
const { paginateArray, isExist, runTasks, removeUndefinedFromObject } = require('../utils/helper');
const { Code } = require('../utils/code');
const logger = require('../utils/logger')

const filterOrganizationsByQuery = (data, query) => {
  const { name, skip, limit } = query;
  if (name) {
    data = data.filter(item => RegExp(name, 'i').test(item[OrganizationSchema.NAME]));
  }

  const result = {
    total: data.length,
    organizations: paginateArray(data, skip, limit)
  };

  return result;
};

exports.getOrganizations = async ({
  name,
  skip,
  limit,
}) => {
  try {

    let err = null;
    let tasks = {
      get_organizations: OrganizationModel.getOrganizations(),
    };

    [err, tasks] = await runTasks(tasks);
    if (err) {
      return Promise.resolve([err]);
    }

    let organizations = tasks.get_organizations;

    const data = filterOrganizationsByQuery(organizations, {
      name,
      skip,
      limit,
    });

    return Promise.resolve([null, data]);

  } catch (err) {
    logger.error('getOrganizations error', err);
    return Promise.resolve([ERROR_CODE.COMMON.InternalError]);
  }
};

const getOrganizationById = async (id) => {
    try {

      let [err, organization] = await OrganizationModel.getOrganizationById(id);

      if (err) {
        return Promise.resolve([err]);
      }

      if (!organization) {
        return Promise.resolve([ERROR_CODE.ORGANIZATION.NotExist]);
      }

      return Promise.resolve([null, organization]);

    } catch(err) {
      logger.error('Get Organization By Id', err);
      return Promise.resolve([ERROR_CODE.COMMON.InternalError]);
    }
}

exports.getOrganizationById = getOrganizationById;

exports.createOrganization = async ({
  name,
  expiredAt,
  isPublish,
  machineIds,
}) => {
  try {
    // const [verifyErr] = await verifyUserRole({ token, userId });
    // if (verifyErr) return Promise.resolve([verifyErr]);
    const code = new Code();
    const baseCode = code.generateBaseCode(8);
    const authenticationCode = code.encode(baseCode);

    const data = removeUndefinedFromObject({
      id: shortId(),
      authenticationCode,
      baseCode,
      name,
      machineIds,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      expiredAt: expiredAt ? expiredAt : Date.now(),
      isPublish,
    });

    let [err, organization] = await OrganizationModel.createOrganization(data)
    if (err) {
      return Promise.resolve([err]);
    }

    return Promise.resolve([null, organization]);
  } catch (err) {
    logger.error('createOrganization error', err);
    return Promise.resolve([ERROR_CODE.COMMON.InternalError]);
  }
}

exports.updateOrganization = async ({
  organizationId: id,
  name,
  expiredAt,
  isPublish,
  machineIds,
}) => {
  try {
    // const [verifyErr] = await verifyUserRole({ token, userId });
    // if (verifyErr) return Promise.resolve([verifyErr]);

    let [err,organization] = await getOrganizationById(id);
    if (err) {
      return Promise.resolve([err]);
    }

    const data = removeUndefinedFromObject({
      id,
      name,
      updatedAt: Date.now(),
      expiredAt,
      isPublish,
      machineIds,
    });

    [err, organization] = await OrganizationModel.updateOrganization(data)
    if (err) {
      return Promise.resolve([err]);
    }

    return Promise.resolve([null, organization]);
  } catch (err) {
    logger.error('update organization error', err);
    return Promise.resolve([ERROR_CODE.COMMON.InternalError]);
  }
}

exports.deleteOrganization = async (id) => {
  try {
    // const [verifyErr] = await verifyUserRole({ token, userId });
    // if (verifyErr) return Promise.resolve([verifyErr]);

    let [err] = await getOrganizationById(id);
    if (err) {
      return Promise.resolve([err]);
    }

    [err] = await OrganizationModel.deleteOrganization(id);
    if (err) {
      return Promise.resolve([err]);
    }

    return Promise.resolve([null]);

  } catch (err) {
    logger.error('Delete Organization error', err);
    return Promise.resolve([ERROR_CODE.COMMON.InternalError]);
  }
}

exports.authenticateCode = async (code) => {

  try {

    let err;
    [err, organization] = await OrganizationModel.authenticateCode(code);
    if (err) {
      return Promise.resolve([err,]);
    }

    if(!organization[OrganizationSchema.IS_PUBLISH]) {
      return Promise.resolve([ERROR_CODE.ORGANIZATION.NotActivated]);
    }

    const now = Date.now();
    if(organization[OrganizationSchema.EXPIRED_AT] < now) {
      return Promise.resolve([ERROR_CODE.ORGANIZATION.Expired]);
    }

    return Promise.resolve([null, organization]);

  } catch (err) {
    logger.error('Authenticate Code error', err);
    return Promise.resolve([ERROR_CODE.COMMON.InternalError]);
  }
}


exports.renewCode = async ({
  organizationId: id,
}) => {
  try {
    // const [verifyErr] = await verifyUserRole({ token, userId });
    // if (verifyErr) return Promise.resolve([verifyErr]);

    let [err,organization] = await getOrganizationById(id);
    if (err) {
      return Promise.resolve([err]);
    }

    const code = new Code();
    const baseCode = code.generateBaseCode(8);
    const authenticationCode = code.encode(baseCode);

    const data = removeUndefinedFromObject({
      [OrganizationSchema.ID]: id,
      [OrganizationSchema.UPDATED_AT]: Date.now(),
      [OrganizationSchema.AUTHENTICATION_CODE]: authenticationCode
    });

    [err, organization] = await OrganizationModel.renewCode(data)
    if (err) {
      return Promise.resolve([err]);
    }

    return Promise.resolve([null, organization]);
  } catch (err) {
    logger.error('update organization error', err);
    return Promise.resolve([ERROR_CODE.COMMON.InternalError]);
  }
}