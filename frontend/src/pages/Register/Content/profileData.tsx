import React from 'react';
import UserModel from 'interfaces/userModel';
import { useAuth } from 'hooks/useAuth';
import 'pages/Register/Content/style.css';
import Statistics from 'components/Statistics';

export default function UserProfileData({
  userProfile,
}: {
  userProfile: UserModel | null;
}) {
  const { user } = useAuth();
  return (
    <>
      <h1 className="profile-title">{userProfile?.name}</h1>
      <p className="profile-text mb-12">
        Username: {userProfile?.username || 'Não definido'}
      </p>
      {user?.username === userProfile?.username && (
        <p className="profile-text mb-12">E-mail: {userProfile?.email}</p>
      )}
      <Statistics userId={userProfile?.id || ''} />
    </>
  );
}
