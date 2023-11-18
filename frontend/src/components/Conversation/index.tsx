import * as React from 'react';
import { Input, Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import './style.css';

export default function Conversation() {
  return (
    <div className="chat-container">
      <div className="chat-messages"></div>
      <div className="chat-input">
        <Input placeholder="Digite uma mensagem" />
        <Button type="primary" icon={<SendOutlined />} />
      </div>
    </div>
  );
}
