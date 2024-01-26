import api from 'services/api';
import ChannelInterface from '../interfaces/channel.interface';
import messageInterface from 'interfaces/message.interface';

async function createChannel(params: ChannelInterface) {
  const result = await api.post('/channel', params);
  return result.data || null;
}

async function getChannel() {
  const result = await api.get('/channel');
  return result.data || null;
}

async function getMessages(roomId: string | null) {
  const result = await api.get(`/channel/message/${roomId}`);
  return result.data || null;
}

async function createMessage(params: messageInterface) {
  const result = await api.post('/channel/message', params);
  return result.data || null;
}

async function verifyChannelPassword(roomId: string, password: string) {
  try {
    const result = await api.post('/channel/verify-password', {
      roomId: roomId,
      password: password,
    });

    return result.data.success;
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function getToken(roomId: string) {
  const result = await api.get(`/channel/token/${roomId}`);
  return result;
}

async function getOwner(channelId: string) {
  const result = await api.get(`/channel/${channelId}`);
  return result;
}

async function updateOwner(channelId: string) {
  const result = await api.patch(`/channel/update-owner/${channelId}`);
  return result;
}

export const channelApi = {
  createChannel,
  getChannel,
  getMessages,
  createMessage,
  verifyChannelPassword,
  getToken,
  getOwner,
  updateOwner,
};
