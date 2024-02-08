import api from 'services/api';
import { LoginBody } from 'interfaces/reqBody/login.interface';
import { createSearchParams } from 'react-router-dom';
import { SignUpBody } from 'interfaces/reqBody/signup.interface';

async function loginWith42(code: string) {
  const params = { code };
  const result = await api.post(
    '/auth/42?' + createSearchParams(params).toString(),
  );
  return result?.data || null;
}

async function login(params: LoginBody) {
  const result = await api.post('/auth/login', params);
  return result?.data || null;
}

async function signUp(params: SignUpBody) {
  const result = await api.post('/auth/sign-up', params);
  return result?.data || null;
}

export const authService = {
  login,
  loginWith42,
  signUp,
};
