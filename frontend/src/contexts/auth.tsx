import React, { createContext, useEffect, useState } from 'react';
import UserModel from 'interfaces/userModel';
import {
  clearAuthorizationHeader,
  setAuthorizationHeader,
} from 'services/auth.service';
import { Spin } from 'antd';

interface AuthContextData {
  signed: boolean;
  user: UserModel | null;
  Login(token: string, user: UserModel): void;
  Logout(): void;
  UpdateUser(user: UserModel): void;
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

  const UpdateUser = (newUserData: UserModel) => {
    localStorage.setItem('user', JSON.stringify(newUserData));
    setUser(newUserData);
  };

  if (loading) {
    return <Spin size="large" fullscreen />;
  }

  return (
    <AuthContext.Provider
      value={{ signed: Boolean(user), user, Login, Logout, UpdateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
