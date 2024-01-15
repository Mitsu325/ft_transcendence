import * as React from 'react';
import { useAuth } from 'hooks/useAuth';
import { Button, Modal } from 'antd';

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

  return (
    <>
      <h1>Histórico</h1>
      <h2>Em construção</h2>
      {user}
    </>
  );
};
