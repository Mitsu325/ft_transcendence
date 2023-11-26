import * as React from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from 'hooks/useAuth';
import PlayerCard from 'components/PlayerCard';
import { Button } from 'antd';
import './style.css';

let socket: Socket;

export const Game = () => {
  const user = useAuth()?.user;
  const [players, setPlayers] = React.useState<
    Array<{ id: string; name: string; avatar: string }>
  >([]);
  const [rooms, setRooms] = React.useState<
    Array<{ id: string; name: string; avatar: string }>
  >([]);

  socket = React.useMemo(() => {
    const newSocket = io('http://localhost:3003', {
      reconnectionDelay: 10000,
    });
    return newSocket;
  }, []);

  React.useEffect(() => {
    const player = {
      id: user?.id,
      name: user?.username,
      avatar: user?.avatar,
    };

    socket.on('connect', () => {
      socket.emit('PlayerConnected', player);
    });

    socket.on('players', players => {
      setPlayers(players);
    });

    socket.on('rooms', rooms => {
      setRooms(rooms);
      console.log(rooms);
    });

    return () => {
      socket.disconnect();
    };
  }, [user?.id, user?.username, user?.avatar]);

  const createRoom = () => {
    socket.emit('CreateRoom', user);
  };

  return (
    <div>
      <h1 style={{ padding: '20px' }}>*** JOGADORES ***</h1>
      <div className="players-container">
        {players.map(player => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>
      <div>
        <Button onClick={createRoom}>Criar sala</Button>
      </div>
    </div>
  );
};
