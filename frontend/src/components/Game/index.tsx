import * as React from 'react';
import io from 'socket.io-client';

export const Game = () => {
  const socket = React.useMemo(() => {
    const newSocket = io('http://localhost:3003', {
      reconnectionDelay: 10000,
    });
    return newSocket;
  }, []);

  React.useEffect(() => {
    socket.on('connect', () => {
      console.log('connected client');
    });

    return () => {
      // Certifique-se de desconectar o socket quando o componente for desmontado
      socket.disconnect();
    };
  }, [socket]);

  return (
    <div>
      <h1>*** Game - Teste ***</h1>
    </div>
  );
};
