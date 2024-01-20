import React from 'react';
import { useAuth } from 'hooks/useAuth';

export default function UserProfileData() {
  const { user } = useAuth();
  return (
    <>
      <h1 className="profile-title">{user?.name}</h1>
      <p className="profile-text">
        Username: {user?.username || 'Não definido'}
      </p>
      <p className="profile-text">E-mail: {user?.email}</p>
    </>
  );
}
