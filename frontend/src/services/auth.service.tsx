import api from 'services/api';

function setAuthorizationHeader(token: string) {
  api.defaults.headers.Authorization = `Bearer ${token}`;
}

function clearAuthorizationHeader() {
  delete api.defaults.headers.common['Authorization'];
}

export { setAuthorizationHeader, clearAuthorizationHeader };
