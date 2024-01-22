import * as React from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from 'hooks/useAuth';
import { Button, Modal } from 'antd';
import { UserOutlined } from '@ant-design/icons';

let socket: Socket;

interface UserStatusProps {
  status: string;
}

export const UserStatus = () => {
  const user = useAuth()?.user;

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

  socket = React.useMemo(() => {
    const newSocket = io('http://localhost:3003', {
      reconnectionDelay: 10000,
    });
    return newSocket;
  }, []);

  // React.useEffect(() => {
  // }, [userStatus]);

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

    // socket.on('get_status', status => {
    // });

    socket.on('ping', () => {
      console.log('ping');
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  React.useEffect(() => {
    function handleWindowBlur() {
      console.log('blur');
    }

    function handleMouseOut() {
      console.log('blur');
    }

    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.addEventListener('blur', handleWindowBlur);
      window.addEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return (
    <>
      <UserOutlined />
    </>
  );
};
