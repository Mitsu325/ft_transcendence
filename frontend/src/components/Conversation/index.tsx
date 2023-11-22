import React, { useState } from 'react';
import { Input, Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { socket } from '../../Socket';
import './style.css';

const Conversation: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState('');

  function connect() {
    console.log('Connect Socket...');
    socket.connect();
  }

  function disconnect() {
    console.log('Disconnect Socket...');
    socket.disconnect();
  }

  const sendMessage = () => {
    socket.emit('sendMessage', inputMessage);
    setInputMessage('');

    const newMessages = [...messages, inputMessage];
    setMessages(newMessages);
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <p className="chat-p" key={index}>
            {msg}
          </p>
        ))}
      </div>
      <div className="chat-input">
        <Button onClick={connect}>Connect Socket</Button>
        {/* <Button onClick={sendMessage}>SendMessage</Button> */}
        <Button onClick={disconnect}>Disconnect Socket</Button>
        <Input
          type="text"
          value={inputMessage}
          onChange={e => setInputMessage(e.target.value)}
          placeholder="Digite uma mensagem"
        />
        <Button onClick={sendMessage} type="primary" icon={<SendOutlined />} />
      </div>
    </div>
  );
};

export default Conversation;
