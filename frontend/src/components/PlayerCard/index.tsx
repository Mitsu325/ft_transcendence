import * as React from 'react';
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

export default PlayerCard;
