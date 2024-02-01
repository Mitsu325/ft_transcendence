import * as React from 'react';
import { Avatar } from 'antd';
import './style.css';
import { Player } from 'interfaces/gameInterfaces/interfaces';

interface RoomGame {
  room_id: string;
  player1: Player;
  player2: Player | null;
}

interface RoomCardProps {
  room: RoomGame;
  getInRoom: (room: RoomGame) => void;
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, getInRoom }) => (
  <div key={room.room_id} className="room-card">
    <a onClick={() => getInRoom(room)}>
      <Avatar
        src={room.player1.avatar}
        size={42}
        style={{ backgroundColor: getRandomColor() }}
      >
        {room.player2?.name ? 'X' : 'Livre'}
      </Avatar>
    </a>
    <div className="room-info">
      <p className="room-name">{room.player1.name}</p>
      <p className="room-name">{room.player2?.name ? 'X' : ''}</p>
      <p className="room-name">{room.player2?.name}</p>
    </div>
  </div>
);

export default RoomCard;
