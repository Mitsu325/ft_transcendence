import api from 'services/api';
import { SendMessageBody } from 'interfaces/reqBody/send-message.interface';
import { Pagination } from 'interfaces/reqBody/pagination.interface';
import { buildPaginationUrl } from 'utils/build-pagination-url';

async function getRecipients() {
  const result = await api.get('/chat/recipients');
  return result.data || null;
}

async function getMessagesFromChattingUser(
  chattingUserId: string,
  pagination?: Pagination,
) {
  const url = buildPaginationUrl(
    `/chat/messages/${chattingUserId}`,
    pagination,
  );
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
