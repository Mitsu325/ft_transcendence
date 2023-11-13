import api from 'services/api';

async function getUser() {
  const result = await api.get('/user/me');
  return result.data || null;
}

export const userService = {
  getUser,
};
