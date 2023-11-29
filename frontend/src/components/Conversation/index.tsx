import React, { useState, useEffect } from 'react';
import { Input, Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { useAuth } from 'hooks/useAuth';
import { socket } from '../../Socket/Socket';
import { sendMessage, connect } from '../../Socket/utilsSocket';
import './style.css';

interface Message {
  userName: string;
  message: string;
}

const Conversation: React.FC<{ roomId: string | null }> = ({ roomId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const { user } = useAuth();
  const userName = user?.name ?? '';

  useEffect(() => {
    connect();

    socket.on('message', (data: { userName: string; message: string }) => {
      console.log(data.message);
      setMessages(prevMessages => [
        ...prevMessages,
        { userName: data.userName, message: data.message },
      ]);
    });
  }, [roomId, userName]);

  const handleSendMessage = () => {
    sendMessage(roomId, newMessage, userName);
    setNewMessage('');
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((data, index) => (
          <p className="chat-p" key={index}>
            <strong>{data.userName}:</strong> {data.message}
          </p>
        ))}
      </div>
      <div className="chat-input">
        {/* <Button onClick={connect}>Connect Socket</Button>
        <Button onClick={disconnect}>Disconnect Socket</Button> */}
        <Input
          type="text"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          placeholder="Digite uma mensagem"
        />
        <Button
          onClick={handleSendMessage}
          type="primary"
          icon={<SendOutlined />}
        />
      </div>
    </div>
  );
};

export default Conversation;
