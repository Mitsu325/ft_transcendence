import * as React from 'react';
import { Divider } from 'antd';
import avatar from 'assets/avatar.png';
import 'pages/Home/style.css';
import UserStatus from 'components/UserStatus';

export default function Home() {
  return (
    <>
      <h1 className="text">JMP Pong!</h1>
      <Divider className="divider" />

      <div className="pong-container">
        <div className="middle-line"></div>
        <div className="paddle paddle-left"></div>
        <div className="paddle paddle-right"></div>
      </div>

      <p className="text">Jogos </p>
      <Divider className="divider" />

      <div className="games-grid">
        <div className="game-card">
          <div className="player-info">
            <img src={avatar} alt="Avatar player 1" />
            <p>Username</p>
          </div>

          <div className="player-info">
            <img src={avatar} alt="Avatar player 2" />
            <p>Username </p>
          </div>
        </div>

        <div className="game-card">
          <div className="player-info">
            <img src={avatar} alt="Avatar Jogador 1" />
            <p>Username</p>
          </div>

          <div className="player-info">
            <img src={avatar} alt="Avatar Jogador 2" />
            <p>Username </p>
          </div>
        </div>
      </div>

      <p className="text">Chats</p>
      <Divider className="divider" />
      <UserStatus />
    </>
  );
}
