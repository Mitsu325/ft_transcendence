import {
  InviteBody,
  InviteStatusBody,
} from 'interfaces/reqBody/invite-status.interface';
import { Pagination } from 'interfaces/reqBody/pagination.interface';
import api from 'services/api';
import { buildPaginationUrl } from 'utils/build-pagination-url';

async function getFriends(pagination?: Pagination) {
  const url = buildPaginationUrl('/friend', pagination);
  const result = await api.get(url);
  return result?.data || null;
}

async function getInviteReceived(pagination?: Pagination) {
  const url = buildPaginationUrl('/friend/invite-received', pagination);
  const result = await api.get(url);
  return result?.data || null;
}

async function getInviteSent(pagination?: Pagination) {
  const url = buildPaginationUrl('/friend/invite-sent', pagination);
  const result = await api.get(url);
  return result?.data || null;
}

async function invite(params: InviteBody) {
  const result = await api.post('/friend/invite', params);
  return result?.data || null;
}

async function updateInviteStatus(params: InviteStatusBody) {
  const result = await api.patch('/friend/invite-status', params);
  return result?.data || null;
}

async function deleteInvite(inviteId: string) {
  const result = await api.delete(`/friend/${inviteId}`);
  return result?.data || null;
}

export const friendService = {
  getFriends,
  getInviteReceived,
  getInviteSent,
  invite,
  updateInviteStatus,
  deleteInvite,
};
