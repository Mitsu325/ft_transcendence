import React, { createContext, useEffect, useState } from 'react';
import UserModel from 'interfaces/userModel';
import {
  clearAuthorizationHeader,
  setAuthorizationHeader,
} from 'services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { Spin } from 'antd';
import FailureNotification from 'components/Notification/FailureNotification';

interface AuthContextData {
  signed: boolean;
  user: UserModel | null;
  Login(token: string, user: UserModel): void;
  Logout(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserModel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    const finishLoading = () => {
      setLoading(false);
    };

    if (storedUser && storedToken) {
      const decodedToken = jwtDecode(storedToken);
      if (decodedToken && decodedToken.exp) {
        if (decodedToken && decodedToken.exp < Math.floor(Date.now() / 1000)) {
          Logout();
          FailureNotification({
            message: 'Sessão encerrada',
            description: 'Por favor, faça login novamente.',
          });
          finishLoading();
          return;
        }
      }

      setAuthorizationHeader(storedToken);
      setUser(JSON.parse(storedUser));
    }
    finishLoading();
  }, []);

  const Login = (token: string, user: UserModel) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    setUser(user);
  };

  const Logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    clearAuthorizationHeader();
  };

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <AuthContext.Provider
      value={{ signed: Boolean(user), user, Login, Logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
