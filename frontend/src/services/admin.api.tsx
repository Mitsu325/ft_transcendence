import api from 'services/api';
import adminInterface from 'interfaces/admin.interface';
import removeAdmInterface from 'interfaces/removeAdm.interface';
import { Pagination } from 'interfaces/reqBody/pagination.interface';
import { buildPaginationUrl } from 'utils/build-pagination-url';

async function getAdmins(channel_id: string, pagination?: Pagination) {
  const url = buildPaginationUrl(`channel-admin/${channel_id}`, pagination);
  const result = await api.get(url);
  return result?.data;
}

async function addAdmin(params: adminInterface) {
  const result = await api.post('channel-admin/add', params);
  return result?.data;
}

async function removeAdmin(params: removeAdmInterface) {
  const result = await api.patch('channel-admin/removeAdmin', params);
  return result?.data;
}

async function getAdminsId(channel_id: string) {
  const result = await api.get(`channel-admin/all/${channel_id}`);
  return result?.data;
}

export const adminService = {
  getAdmins,
  addAdmin,
  removeAdmin,
  getAdminsId,
};
