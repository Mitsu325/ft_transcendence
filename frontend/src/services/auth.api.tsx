import api from 'services/api';
import { LoginBody } from 'interfaces/reqBody/login.interface';

async function login(params: LoginBody) {
  const result = await api.post('/auth/login', params);
  return result.data || null;
}

export const authService = {
  login,
};
