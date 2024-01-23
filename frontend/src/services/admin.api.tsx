import api from 'services/api';
import adminInterface from 'interfaces/admin.interface';

async function getAdmins(channel_id: string) {
  const result = await api.get(`channel-admin/${channel_id}`);
  return result.data;
}

async function addAdmin(params: adminInterface) {
  const result = await api.post('channel-admin/add', params);
  return result.data;
}

export const adminService = {
  getAdmins,
  addAdmin,
};
