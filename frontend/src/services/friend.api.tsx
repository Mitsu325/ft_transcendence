/* eslint-disable no-useless-catch */
import {
  InviteBody,
  InviteStatusBody,
} from 'interfaces/reqBody/invite-status.interface';
import { Pagination } from 'interfaces/reqBody/pagination.interface';
import api from 'services/api';
import { buildPaginationUrl } from 'utils/build-pagination-url';

async function getFriends(pagination?: Pagination) {
  const url = buildPaginationUrl('/friend', pagination);
  try {
    const result = await api.get(url);
    return result?.data || null;
  } catch (error) {
    throw error;
  }
}

async function getInviteReceived(pagination?: Pagination) {
  const url = buildPaginationUrl('/friend/invite-received', pagination);
  try {
    const result = await api.get(url);
    return result?.data || null;
  } catch (error) {
    throw error;
  }
}

async function getInviteSent(pagination?: Pagination) {
  const url = buildPaginationUrl('/friend/invite-sent', pagination);
  try {
    const result = await api.get(url);
    return result?.data || null;
  } catch (error) {
    throw error;
  }
}

async function invite(params: InviteBody) {
  try {
    const result = await api.post('/friend/invite', params);
    return result?.data || null;
  } catch (error) {
    throw error;
  }
}

async function updateInviteStatus(params: InviteStatusBody) {
  try {
    const result = await api.patch('/friend/invite-status', params);
    return result?.data || null;
  } catch (error) {
    throw error;
  }
}

async function deleteInvite(inviteId: string) {
  try {
    const result = await api.delete(`/friend/${inviteId}`);
    return result?.data || null;
  } catch (error) {
    throw error;
  }
}

export const friendService = {
  getFriends,
  getInviteReceived,
  getInviteSent,
  invite,
  updateInviteStatus,
  deleteInvite,
};
