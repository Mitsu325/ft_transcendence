import React from 'react';
import { useAuth } from 'hooks/useAuth';

export default function UserSecurity() {
  const { user } = useAuth();
  return (
    <>
      <h1 className="profile-title">{user?.name}</h1>
      <h2>Configuração de senha, 2FA...</h2>
    </>
  );
}
