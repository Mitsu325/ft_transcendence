import api from 'services/api';
import adminInterface from 'interfaces/admin.interface';
import removeAdmInterface from 'interfaces/removeAdm.interface';

async function getAdmins(channel_id: string) {
  const result = await api.get(`channel-admin/${channel_id}`);
  return result.data;
}

async function addAdmin(params: adminInterface) {
  const result = await api.post('channel-admin/add', params);
  return result.data;
}

async function removeAdmin(params: removeAdmInterface) {
  const result = await api.patch('channel-admin/removeAdmin', params);
  return result.data;
}

async function getAdminsId(channel_id: string) {
  const result = await api.get(`channel-admin/all/${channel_id}`);
  return result.data;
}

export const adminService = {
  getAdmins,
  addAdmin,
  removeAdmin,
  getAdminsId,
};
