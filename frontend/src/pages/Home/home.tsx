import * as React from 'react';
import { Divider } from 'antd';
import '../../pages/Home/style.css';

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
    </>
  );
}
