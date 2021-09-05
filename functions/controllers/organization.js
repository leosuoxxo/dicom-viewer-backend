const { ERROR_CODE } = require('../constants.js');
const OrganizationModel = require('../models/organization');
const OrganizationSchema = require('../models/schemas/organization.schemas')
const { shortId } = require('../utils/helper');
const { paginateArray, isExist, runTasks, removeUndefinedFromObject } = require('../utils/helper');
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
  taxIdNumber,
  name,
  contactPerson,
  expiredAt,
  isPublish,
}) => {
  try {
    // const [verifyErr] = await verifyUserRole({ token, userId });
    // if (verifyErr) return Promise.resolve([verifyErr]);

    const data = removeUndefinedFromObject({
      id: shortId(),
      taxIdNumber,
      contactPerson,
      authenticationCode: null,
      name,
      contactPerson,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      expiredAt,
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
  taxIdNumber,
  name,
  contactPerson,
  expiredAt,
  isPublish,
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
      taxIdNumber,
      name,
      contactPerson,
      updatedAt: Date.now(),
      expiredAt,
      isPublish,
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