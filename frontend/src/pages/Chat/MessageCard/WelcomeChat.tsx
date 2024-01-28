import React from 'react';
import { WechatOutlined } from '@ant-design/icons';
import 'pages/Chat/MessageCard/style.css';

export default function WelcomeChat() {
  return (
    <div className="center-obj">
      <WechatOutlined
        className="mb-24"
        style={{ color: '#001529', fontSize: '60px' }}
      />
      <h1 className="message-header-title w-60">
        Vamos lá! Escolha um amigo para bater um papo e aproveitar o momento.
      </h1>
    </div>
  );
}
