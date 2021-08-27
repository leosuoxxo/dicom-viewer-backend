import * as OrganizationModel from '../models/organization.model';

export const getOrganizations = async () => {
  const data = OrganizationModel.getOrganizations();
  return data
}