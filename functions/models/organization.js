const { ERROR_CODE } = require('../constants');
const OrganizationSchema = require('./schemas/organization.schemas');
const { app: { db } } = require('../firestore');

const { consumeTasks } = require('../utils/tasks');
const { isExist } = require('../utils/helper');
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

exports.createOrganization = async ({
  id,
  taxIdNumber,
  authenticationCode,
  name,
  contactPerson,
  createdAt,
  updatedAt,
  expiredAt,
  isPublish,
}) => {
  try {
    const ref = db.collection(ORGANIZATIONS).doc(id);
    
    const { 
      ID, 
      TAX_ID_NUMBER, 
      CONTACT_PERSON, 
      AUTHENTICATION_CODE,
      NAME,
      CREATED_AT,
      UPDATED_AT,
      EXPIRED_AT,
      IS_PUBLISH,
    } = OrganizationSchema;

    const organization = {
      [ID]: id,
      [TAX_ID_NUMBER]: taxIdNumber,
      [CONTACT_PERSON]: contactPerson,
      [AUTHENTICATION_CODE]: authenticationCode,
      [NAME]: name,
      [CREATED_AT]: createdAt,
      [UPDATED_AT]: updatedAt,
      [EXPIRED_AT]: expiredAt,
      [IS_PUBLISH]: isPublish,
    };

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