import React from 'react';
import { useAuth } from 'hooks/useAuth';
import UploadAvatar from './uploadAvatar';

export default function UserEditProfile() {
  const { user } = useAuth();

  return (
    <>
      <h1 className="profile-title">{user?.name}</h1>
      <UploadAvatar />
    </>
  );
}
