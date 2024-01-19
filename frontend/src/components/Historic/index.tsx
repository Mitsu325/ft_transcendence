import * as React from 'react';
import { useAuth } from 'hooks/useAuth';
import api from 'services/api';
import { Button, Modal } from 'antd';

const getHistoric = async (userId: string) => {
  try {
    const response = await api.post('/battles/historic_battles', {
      userId: userId,
    });
    if (response.data.verified) {
      console.log(response.data);
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error(err);
  }
};

export const Historic = () => {
  const user = useAuth()?.user;

  const userPlayer = React.useMemo(() => {
    const newPlayer = {
      id: user?.id ?? '',
      name: user?.name ?? '',
      avatar: user?.avatar ?? null,
    };
    return newPlayer;
  }, [user]);

  React.useEffect(() => {
    console.log(user);
  }, []);

  return (
    <>
      <h2>Histórico de Partidas</h2>
      <Button type="primary" onClick={() => getHistoric(userPlayer.id)}>
        Buscar Histórico
      </Button>
    </>
  );
};
