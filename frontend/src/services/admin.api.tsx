import api from 'services/api';
import adminInterface from 'interfaces/admin.interface';
import removeAdmInterface from 'interfaces/removeAdm.interface';
import { Pagination } from 'interfaces/reqBody/pagination.interface';
import { buildPaginationUrl } from 'utils/build-pagination-url';
import { UpdateAdminAction } from 'interfaces/reqBody/admin-action.interface';
import { ActionType } from 'interfaces/channel.interface';

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

async function getAdminActions(
  channel_id: string,
  action: ActionType,
  pagination?: Pagination,
) {
  let url = `channel-admin/action/${channel_id}`;

  if (pagination) {
    const params = new URLSearchParams({
      page: pagination.page.toString(),
      action,
      limit: pagination.limit.toString(),
    });

    url += `?${params.toString()}`;
  } else {
    const params = new URLSearchParams({
      action,
    });

    url += `?${params.toString()}`;
  }

  const result = await api.get(url);
  return result?.data;
}

async function updateAdminActions(params: UpdateAdminAction) {
  const result = await api.post('channel-admin/action', params);
  return result?.data || null;
}

async function getMemberAction(channelId: string, memberId: string) {
  const result = await api.get(
    `channel-admin/member-action/${channelId}/${memberId}`,
  );
  return result?.data;
}

export const adminService = {
  getAdmins,
  addAdmin,
  removeAdmin,
  getAdminsId,
  getAdminActions,
  updateAdminActions,
  getMemberAction,
};
