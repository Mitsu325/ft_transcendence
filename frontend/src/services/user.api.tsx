import { createSearchParams } from 'react-router-dom';
import api from 'services/api';

async function getUser() {
  const result = await api.get('/user/me');
  return result.data || null;
}

async function getAllUsers() {
  const result = await api.get('user/all');
  return result.data || null;
}

async function getUserById(userId: string) {
  const result = await api.get(`/user/${userId}`);
  return result.data || null;
}

async function searchUserByName(name: string) {
  const params = { name };
  const result = await api.get(
    '/user/search?' + createSearchParams(params).toString(),
  );
  return result.data || null;
}

export const userService = {
  getUser,
  getAllUsers,
  searchUserByName,
  getUserById,
};
