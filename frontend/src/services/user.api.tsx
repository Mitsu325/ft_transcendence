import { createSearchParams } from 'react-router-dom';
import api from 'services/api';
import { User_Status } from '../interfaces/userStatus';

async function getUser() {
  const result = await api.get('/user/me');
  return result.data || null;
}

async function getUserById(userId: string) {
  const result = await api.get(`/user/id/${userId}`);
  return result.data || null;
}

async function getUserByUsername(username: string) {
  const result = await api.get(`/user/username/${username}`);
  return result.data || null;
}

async function searchUserByName(name: string) {
  const params = { name };
  const result = await api.get(
    '/user/search?' + createSearchParams(params).toString(),
  );
  return result.data || null;
}

async function uploadAvatar(file: File) {
  const result = await api.post('/user/sign-up', file);
  return result.data || null;
}

async function update2fa(twoFactorAuth: boolean) {
  const result = await api.post('/user/set/two-factor-auth', { twoFactorAuth });
  return result.data || null;
}

async function updateUserStatus(userStatus: User_Status) {
  const result = await api.post('user/set/user-status', userStatus);
  console.log(result);
  // return result.data || null;
}

export const userService = {
  getUser,
  searchUserByName,
  getUserById,
  getUserByUsername,
  uploadAvatar,
  update2fa,
  updateUserStatus,
};
