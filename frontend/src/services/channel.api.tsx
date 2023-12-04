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
  const result = await api.get(`/channel/message?roomId=${roomId}`);
  return result.data || null;
}

async function createMessage(params: messageInterface) {
  const result = await api.post('/channel/message', params);
  return result.data || null;
}

export const channelService = {
  createChannel,
  getChannel,
  getMessages,
  createMessage,
};
