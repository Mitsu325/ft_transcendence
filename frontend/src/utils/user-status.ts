import * as React from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from 'hooks/useAuth';
import { useLocation } from 'react-router-dom';

let socket: Socket;

interface UserStatusProps {
  status: string;
}

export const UserStatusSocket = () => {
  const user = useAuth()?.user;
  const location = useLocation();

  const userPlayer = React.useMemo(() => {
    const newPlayer = {
      id: user?.id ?? '',
      name: user?.name ?? '',
      avatar: user?.avatar ?? null,
    };
    return newPlayer;
  }, [user]);

  const [userStatus, setUserStatus] = React.useState<UserStatusProps>({
    status: 'offline',
  });

  const [userLoc, setUserLoc] = React.useState<any>();

  React.useEffect(() => {
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

  socket = React.useMemo(() => {
    const newSocket = io('http://localhost:3003', {
      reconnectionDelay: 10000,
    });
    return newSocket;
  }, []);

  React.useEffect(() => {
    socket.on('connect', () => {
      setUserStatus({ status: 'online' });
    });

    socket.on('ping', (latency: number) => {
      if (latency !== undefined) {
        socket.emit('pong', latency);
      } else {
        socket.emit('ping');
      }
    });

    socket.on('ping', () => {
      console.log('ping');
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  React.useEffect(() => {
    function handleWindowBlur() {
      setUserLoc(location.pathname);
      console.log('out: ', new Date().toLocaleTimeString());
      console.log('rota: ', userLoc);
    }

    function handleMouseOut() {
      console.log('mouse: ', new Date().toLocaleTimeString());
      console.log('rota: ', location.pathname);
    }

    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.addEventListener('blur', handleWindowBlur);
      window.addEventListener('mouseout', handleMouseOut);
    };
  }, []);
};
