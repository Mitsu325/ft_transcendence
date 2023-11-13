import React, { createContext, useEffect, useState } from 'react';
import UserModel from 'interfaces/userModel';
import {
  clearAuthorizationHeader,
  setAuthorizationHeader,
} from 'services/auth.service';

interface AuthContextData {
  signed: boolean;
  user: UserModel | null;
  Login(token: string, user: UserModel): void;
  Logout(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserModel | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      setAuthorizationHeader(storedToken);
      setUser(JSON.parse(storedUser));
    }
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

  return (
    <AuthContext.Provider
      value={{ signed: Boolean(user), user, Login, Logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
