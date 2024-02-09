import React from 'react';
import { useAuth } from 'hooks/useAuth';
import UserModel from 'interfaces/userModel';
import AppAuthenticator from './appAuthenticator';
import Password from './password';

export default function UserSecurity({
  userProfile,
}: {
  userProfile: UserModel | null;
}) {
  const { user } = useAuth();

  const renderContent = () => {
    if (user?.username === userProfile?.username) {
      return (
        <>
          <Password />
          <AppAuthenticator />
        </>
      );
    }
    return (
      <p>
        Desculpe, você não tem permissão para editar as informações deste
        usuário. A edição está disponível apenas para o próprio usuário.
      </p>
    );
  };

  return (
    <>
      <h1 className="title">{userProfile?.name}</h1>
      {renderContent()}
    </>
  );
}
