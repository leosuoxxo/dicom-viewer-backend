const { ERROR_CODE } = require('../constants');
const OrganizationSchema = require('./schemas/organization.schemas');
const { app: { db } } = require('../firestore');

const logger = require('../utils/logger')

const ORGANIZATIONS = 'organizations';

exports.getOrganizations = async () => {
  try {

    let ref = db.collection(ORGANIZATIONS);

    const snapshots = await ref.get();

    let results = [];
    snapshots.forEach(doc => {
      const data = doc.data();
      if (!data[OrganizationSchema.IS_DELETED]) {
        results.push(data);
      }
    });

    return Promise.resolve([null, results]);

  } catch (error) {
    logger.error('getOrganizations error', error);
    return Promise.resolve([ERROR_CODE.COMMON.InternalError]);
  }
};

exports.getOrganizationById = async (id) => {
  try {

    let ref = db.collection(ORGANIZATIONS).where(OrganizationSchema.ID, "==", id);
    const snapshots = await ref.get();

    let results = [];
    snapshots.forEach(doc => {
      const data = doc.data();
      results.push(data);
    });

    if (results.length < 1) {
      return Promise.resolve([ERROR_CODE.ORGANIZATION.NotExist]);
    }

    const [organization] = results;

    return Promise.resolve([null, organization]);

  } catch (error) {
    logger.error('Get Organization By Id error', error);
    return Promise.resolve([ERROR_CODE.COMMON.InternalError]);
  }
}

exports.createOrganization = async (organization) => {
  try {
    const { id } = organization;
    const ref = db.collection(ORGANIZATIONS).doc(id);

    await ref.set(organization);

    return Promise.resolve([null, organization]);
  } catch (error) {
    logger.error('createOrganization error', error);
    return Promise.resolve([ERROR_CODE.COMMON.InternalError]);
  }
}

exports.updateOrganization = async (params) => {
  try {
    const { id, ...data } = params;
    const ref = db.collection(ORGANIZATIONS).doc(id);
    
    await ref.set(data, { merge: true });
    const organization = (await ref.get()).data();

    return Promise.resolve([null, organization]);
  } catch (error) {
    logger.error('updateOrganization error', error);
    return Promise.resolve([ERROR_CODE.COMMON.InternalError]);
  }
}

exports.deleteOrganization = async (id) => {
  try {
    const ref = db.collection(ORGANIZATIONS).doc(id);
    await ref.set({ [OrganizationSchema.IS_DELETED]: true }, { merge: true });

    return Promise.resolve([null]);
  } catch (error) {
    logger.error('Delete Organization error', error);
    return Promise.resolve([ERROR_CODE.COMMON.InternalError]);
  }
}

exports.authenticateCode = async(code) => {
  try {

    let ref = db.collection(ORGANIZATIONS).where(OrganizationSchema.AUTHENTICATION_CODE, "==", code);
    const snapshots = await ref.get();

    let results = [];
    snapshots.forEach(doc => {
      const data = doc.data();
      results.push(data);
    });

    if (results.length < 1) {
      return Promise.resolve([ERROR_CODE.ORGANIZATION.NotExist]);
    }

    const [organization] = results;
    
    return Promise.resolve([null, organization]);

  } catch (error) {
    logger.error('Authenticate Code By Id error', error);
    return Promise.resolve([ERROR_CODE.COMMON.InternalError]);
  }
}

exports.renewCode = async(params) => {
  try {
    const { id, ...data } = params;
    const ref = db.collection(ORGANIZATIONS).doc(id);
    await ref.set(data, { merge: true });
    const organization = (await ref.get()).data();

    return Promise.resolve([null, organization]);

  } catch (error) {
    logger.error('Renew Code error', error);
    return Promise.resolve([ERROR_CODE.COMMON.InternalError]);
  }
}