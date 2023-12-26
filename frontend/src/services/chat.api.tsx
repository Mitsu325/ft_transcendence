import api from 'services/api';
import { SendMessageBody } from 'interfaces/reqBody/send-message.interface';

async function getRecipients() {
  const result = await api.get('/chat/recipients');
  return result.data || null;
}

async function getMessagesFromChattingUser(chattingUserId: string) {
  const result = await api.get(`/chat/messages/${chattingUserId}`);
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
