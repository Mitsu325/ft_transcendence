import { InviteStatusBody } from 'interfaces/reqBody/invite-status.interface';
import { Pagination } from 'interfaces/reqBody/pagination.interface';
import { createSearchParams } from 'react-router-dom';
import api from 'services/api';

async function getFriends(pagination?: Pagination) {
  let url = '/friend';
  if (pagination) {
    const params = {
      page: pagination.page.toString(),
      limit: pagination.limit.toString(),
    };
    url += '?' + createSearchParams(params).toString();
  }
  const result = await api.get(url);
  return result.data || null;
}

async function updateInviteStatus(params: InviteStatusBody) {
  const result = await api.patch('/friend/invite-status', params);
  return result.data || null;
}

export const friendService = {
  getFriends,
  updateInviteStatus,
};
