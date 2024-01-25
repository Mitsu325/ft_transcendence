/* eslint-disable no-useless-catch */
import api from 'services/api';
import { LoginBody } from 'interfaces/reqBody/login.interface';
import { createSearchParams } from 'react-router-dom';
import { SignUpBody } from 'interfaces/reqBody/signup.interface';

async function loginWith42(code: string) {
  const params = { code };
  try {
    const result = await api.post(
      '/auth/42?' + createSearchParams(params).toString(),
    );
    return result?.data || null;
  } catch (error) {
    throw error;
  }
}

async function login(params: LoginBody) {
  try {
    const result = await api.post('/auth/login', params);
    return result?.data || null;
  } catch (error) {
    throw error;
  }
}

async function signUp(params: SignUpBody) {
  try {
    const result = await api.post('/auth/sign-up', params);
    return result?.data || null;
  } catch (error) {
    throw error;
  }
}

export const authService = {
  login,
  loginWith42,
  signUp,
};
