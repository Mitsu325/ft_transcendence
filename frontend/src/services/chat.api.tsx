import api from 'services/api';

async function getRecipients() {
  const result = await api.get('/chat/recipients');
  return result.data || null;
}

async function getMessagesFromChattingUser(chattingUserId: string) {
  const result = await api.get(`/chat/messages/${chattingUserId}`);
  return result.data || null;
}

export const chatService = {
  getRecipients,
  getMessagesFromChattingUser,
};
