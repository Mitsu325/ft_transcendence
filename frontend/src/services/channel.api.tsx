import api from 'services/api';
import { ChannelInterface } from '../interfaces/channel.interface';
import messageInterface from 'interfaces/message.interface';

async function createChannel(params: ChannelInterface) {
  const result = await api.post('/channel', params);
  return result?.data || null;
}

async function getChannel() {
  const result = await api.get('/channel');
  return result?.data || null;
}

async function getMessages(roomId: string | null) {
  const result = await api.get(`/channel/message/${roomId}`);
  return result?.data || null;
}

async function createMessage(params: messageInterface) {
  const result = await api.post('/channel/message', params);
  return result?.data || null;
}

async function verifyChannelPassword(roomId: string, password: string) {
  try {
    const result = await api.post('/channel/verify-password', {
      roomId: roomId,
      password: password,
    });

    return result?.data.success;
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

async function addPassword(channelId: string, password: string) {
  const result = await api.patch('/channel/add-password', {
    channelId: channelId,
    password: password,
  });
  return result;
}

async function changePassword(
  channelId: string,
  oldPassword: string,
  newPassword: string,
) {
  const result = await api.patch('/channel/change-password', {
    channelId: channelId,
    oldPassword: oldPassword,
    newPassword: newPassword,
  });
  return result;
}

async function removePassword(channelId: string, oldPassword: string) {
  const result = await api.patch('/channel/remove-password', {
    channelId: channelId,
    oldPassword: oldPassword,
  });
  return result;
}

async function isUserInChannel(userId: string, channelId: string) {
  const result = await api.get(`/channel/${userId}/${channelId}`);
  return result.data;
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
  addPassword,
  changePassword,
  removePassword,
  isUserInChannel,
};
