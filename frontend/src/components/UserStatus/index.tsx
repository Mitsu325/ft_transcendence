import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserStatusSocket } from 'utils/user-status';

const UserStatus = () => {
  // const navigate = useNavigate();
  const location = useLocation();

  UserStatusSocket();

  useEffect(() => {
    const handleRotaChange = () => {
      console.log('Usuário entrou em uma nova rota:', location.pathname);
    };

    const unlisten = () => {
      handleRotaChange();
    };

    handleRotaChange();

    return () => {
      unlisten();
    };
  }, [location.pathname]);

  return <div> {/* Conteúdo do seu componente */} </div>;
};

export default UserStatus;
