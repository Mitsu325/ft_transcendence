import * as React from 'react';
import io from 'socket.io-client';
import { useAuth } from 'hooks/useAuth';
import { Avatar } from 'antd';
import './style.css';

interface Player {
  id: string;
  name: string;
  avatar: string;
}

interface PlayerCardProps {
  player: Player;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => (
  <div key={player.id} className="player-card">
    <Avatar src={player.avatar} style={{ backgroundColor: '#f56a00' }}>
      {player.name.substring(0, 1).toUpperCase()}
    </Avatar>
    <div className="player-info">
      <p className="player-name">{player.name}</p>
    </div>
  </div>
);

export const Game = () => {
  const user = useAuth();
  const [players, setPlayers] = React.useState<
    Array<{ id: string; name: string; avatar: string }>
  >([]);

  const socket = React.useMemo(() => {
    const newSocket = io('http://localhost:3003', {
      reconnectionDelay: 10000,
    });
    return newSocket;
  }, []);

  React.useEffect(() => {
    const player = {
      id: user?.user?.id,
      name: user?.user?.username,
      avatar: user?.user?.avatar,
    };

    socket.on('connect', () => {
      socket.emit('PlayerConnected', player);
    });

    socket.on('players', players => {
      setPlayers(players);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket, user?.user?.id, user?.user?.username, user?.user?.avatar]);

  return (
    <div>
      <h1>*** JOGADORES ***</h1>
      <div className="players-container">
        {players.map(player => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>
    </div>
  );
};
