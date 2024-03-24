import axios, { AxiosError, AxiosResponse } from 'axios';
import FailureNotification from 'components/Notification/FailureNotification';
import { useAuth } from 'hooks/useAuth';

const api = axios.create({
  baseURL: process.env.VERCEL_URL || '',
});

api.interceptors.response.use(
  (response: AxiosResponse<unknown, unknown>) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      const { Logout } = useAuth();
      Logout();
      FailureNotification({
        message: 'Sessão encerrada',
        description: 'Por favor, faça login novamente.',
      });
    }
  },
);

export default api;
