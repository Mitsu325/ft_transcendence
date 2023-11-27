import * as React from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from 'hooks/useAuth';
import PlayerCard from 'components/PlayerCard';
import RoomCard from 'components/RoomCard';
import { Button } from 'antd';
import './style.css';

let socket: Socket;

interface Player {
  id: string;
  name: string;
  avatar: string;
}

interface Room {
  room_id: string;
  player1: Player;
  player2: Player;
}

export const Game = () => {
  const user = useAuth()?.user;
  const [players, setPlayers] = React.useState<
    Array<{ id: string; name: string; avatar: string }>
  >([]);
  const [rooms, setRooms] = React.useState<
    Array<{
      room_id: string;
      player_id: string;
      player_name: string;
      player_avatar: string;
    }>
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
      const formattedRooms = rooms.map((room: Room) => {
        return {
          room_id: room.player1.id,
          player_id: room.player1.id,
          player_name: room.player1.name,
          player_avatar: room.player1.avatar,
        };
      });
      setRooms(formattedRooms);
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
      <h1 style={{ padding: '20px' }}>*** SALAS ***</h1>
      <div>
        <Button onClick={createRoom}>Criar sala</Button>
      </div>
      <div className="rooms-container">
        {rooms.map(room => (
          <RoomCard key={room.room_id} room={room} />
        ))}
      </div>
    </div>
  );
};
