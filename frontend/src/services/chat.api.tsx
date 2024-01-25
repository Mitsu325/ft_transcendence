/* eslint-disable no-useless-catch */
import api from 'services/api';
import { SendMessageBody } from 'interfaces/reqBody/send-message.interface';
import { Pagination } from 'interfaces/reqBody/pagination.interface';
import { buildPaginationUrl } from 'utils/build-pagination-url';
import {
  BlockedBody,
  ChangeBlockedBody,
} from 'interfaces/reqBody/blocked.interface';

async function getRecipients() {
  try {
    const result = await api.get('/chat/recipients');
    return result?.data || null;
  } catch (error) {
    throw error;
  }
}

async function getMessagesFromChattingUser(
  chattingUserId: string,
  pagination?: Pagination,
) {
  const url = buildPaginationUrl(
    `/chat/messages/${chattingUserId}`,
    pagination,
  );
  try {
    const result = await api.get(url);
    return result?.data || null;
  } catch (error) {
    throw error;
  }
}

async function sendMessage(params: SendMessageBody) {
  try {
    const result = await api.post('/chat/send-message', params);
    return result?.data || null;
  } catch (error) {
    throw error;
  }
}

async function getBlockedUsers() {
  try {
    const result = await api.get('/chat/blocked-users');
    return result?.data || null;
  } catch (error) {
    throw error;
  }
}

async function blockUser(params: BlockedBody) {
  try {
    const result = await api.post('/chat/block-user', params);
    return result.data || null;
  } catch (error) {
    throw error;
  }
}

async function updateBlockUser(params: ChangeBlockedBody) {
  try {
    const result = await api.patch('/chat/block-user', params);
    return result?.data || null;
  } catch (error) {
    throw error;
  }
}

export const chatService = {
  getRecipients,
  getMessagesFromChattingUser,
  sendMessage,
  getBlockedUsers,
  blockUser,
  updateBlockUser,
};
