import api from 'services/api';
import ChannelInterface from '../interfaces/channel.interface';

async function createChannel(params: ChannelInterface) {
  const result = await api.post('/channel', params);
  return result.data || null;
}

async function getChannel() {
  const result = await api.get('/channel');
  return result.data || null;
}

export const channelService = {
  createChannel,
  getChannel,
};
