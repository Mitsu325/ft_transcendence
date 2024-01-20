import { jwtDecode } from 'jwt-decode';

export const isTokenExpired = () => {
  const token = localStorage.getItem('token');

  if (token) {
    try {
      const { exp } = jwtDecode(token);
      if (!exp) return true;
      const currentTimestamp = Math.floor(Date.now() / 1000);
      return exp < currentTimestamp;
    } catch (error) {
      console.error('Erro ao decodificar o token:', error);
      return true;
    }
  }

  return true;
};
