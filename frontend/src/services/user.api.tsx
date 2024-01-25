/* eslint-disable no-useless-catch */
import { createSearchParams } from 'react-router-dom';
import api from 'services/api';

async function getUser() {
  try {
    const result = await api.get('/user/me');
    return result?.data || null;
  } catch (error) {
    throw error;
  }
}

async function getUserById(userId: string) {
  try {
    const result = await api.get(`/user/id/${userId}`);
    return result?.data || null;
  } catch (error) {
    throw error;
  }
}

async function getUserByUsername(username: string) {
  try {
    const result = await api.get(`/user/username/${username}`);
    return result?.data || null;
  } catch (error) {
    throw error;
  }
}

async function searchUserByName(name: string) {
  const params = { name };
  try {
    const result = await api.get(
      '/user/search?' + createSearchParams(params).toString(),
    );
    return result?.data || null;
  } catch (error) {
    throw error;
  }
}

async function uploadAvatar(file: File) {
  try {
    const result = await api.post('/user/sign-up', file);
    return result?.data || null;
  } catch (error) {
    throw error;
  }
}

async function update2fa(twoFactorAuth: boolean) {
  try {
    const result = await api.post('/user/set/two-factor-auth', {
      twoFactorAuth,
    });
    return result?.data || null;
  } catch (error) {
    throw error;
  }
}

export const userService = {
  getUser,
  searchUserByName,
  getUserById,
  getUserByUsername,
  uploadAvatar,
  update2fa,
};
