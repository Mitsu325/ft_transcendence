import api from 'services/api';
import { SendMessageBody } from 'interfaces/reqBody/send-message.interface';
import { createSearchParams } from 'react-router-dom';

interface Pagination {
  page: number;
  limit: number;
}

async function getRecipients() {
  const result = await api.get('/chat/recipients');
  return result.data || null;
}

async function getMessagesFromChattingUser(
  chattingUserId: string,
  pagination?: Pagination,
) {
  let url = `/chat/messages/${chattingUserId}`;
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

async function sendMessage(params: SendMessageBody) {
  const result = await api.post('/chat/send-message', params);
  return result.data || null;
}

export const chatService = {
  getRecipients,
  getMessagesFromChattingUser,
  sendMessage,
};
