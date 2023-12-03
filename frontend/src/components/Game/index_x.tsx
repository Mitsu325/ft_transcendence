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
  avatar: string | null;
}

interface RoomGame {
  room_id: string;
  player1: Player;
  player2: Player | null;
}

export const Game = () => {
  const user = useAuth()?.user;

  const userPlayer = React.useMemo(() => {
    const newPlayer = {
      id: user?.id ?? '',
      name: user?.name ?? '',
      avatar: user?.avatar ?? null,
    };
    return newPlayer;
  }, [user]);

  const [players, setPlayers] = React.useState<Player[]>([]);
  const [rooms, setRooms] = React.useState<RoomGame[]>([]);
  const [status, setStatus] = React.useState<string>();
  const [match, setMatch] = React.useState(false);
  const [connected, setConnected] = React.useState(false);

  socket = React.useMemo(() => {
    const newSocket = io('http://localhost:3003', {
      reconnectionDelay: 10000,
    });
    return newSocket;
  }, []);

  React.useEffect(() => {
    socket.on('connect', () => {
      socket.emit('PlayerConnected', user);
      setConnected(true);
    });

    socket.on('players', players => {
      setPlayers(players);
    });

    socket.on('rooms', (rooms: RoomGame[]) => {
      setRooms(rooms);
    });
    return () => {
      socket.disconnect();
      setConnected(false);
    };
  }, [user]);

  const createRoom = () => {
    socket.emit('CreateRoom', userPlayer);
    setStatus(
      `Você criou a sala ( ${userPlayer.name} ), agora é só esperar alguém entrar para jogar!`,
    );
  };

  const getInRoom = (room: RoomGame) => {
    if (userPlayer.id != room.player1.id) {
      room.player2 = userPlayer;
      socket.emit('GetInRoom', room);
      setMatch(true);
    } else {
      setStatus(
        `Você criou a sala ( ${room.player1.name} ), espere alguém entrar para jogar!`,
      );
    }
  };

  return (
    <>
      {match && connected ? (
        <div style={{ display: 'flex', width: '100%' }}>
          <h1 style={{ padding: '20px' }}>*** JOGO ***</h1>
        </div>
      ) : (
        <div style={{ display: 'flex', width: '100%' }}>
          <div style={{ flex: '70%', marginRight: '30px' }}>
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
                <RoomCard
                  key={room.room_id}
                  room={room}
                  getInRoom={getInRoom}
                />
              ))}
            </div>
          </div>
          <div style={{ flex: '30%' }}>
            <h2 style={{ padding: '20px' }}>{status}</h2>
          </div>
        </div>
      )}
    </>
  );
};
