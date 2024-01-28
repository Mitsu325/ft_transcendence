import React from 'react';
import AvatarCustom from 'components/Avatar';
import { Player } from 'interfaces/gameInterfaces/interfaces';
import './style.css';

interface PlayerCardProps {
  player: Player;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => (
  <div className="player-card">
    <AvatarCustom
      src={player.avatar || ''}
      size={42}
      className="bg-green mr-12"
    />
    <div>
      <p className="text">{player.name}</p>
      <span className="player-info">{player.username}</span>
    </div>
  </div>
);

export default PlayerCard;
