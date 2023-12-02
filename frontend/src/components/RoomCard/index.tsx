import * as React from 'react';
import { Avatar } from 'antd';
import './style.css';

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
    <a href="#" onClick={() => getInRoom(room)}>
      <Avatar
        src={room.player1.avatar}
        style={{ backgroundColor: getRandomColor() }}
      >
        Sala
      </Avatar>
    </a>
    <div className="room-info">
      <p className="room-name">{room.player1.name}</p>
    </div>
  </div>
);

export default RoomCard;
