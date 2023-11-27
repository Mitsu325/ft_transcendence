import React, { useState, useEffect } from 'react';
import { Input, Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { useAuth } from 'hooks/useAuth';
import { socket } from '../../Socket';
import './style.css';

interface Message {
  userName: string;
  message: string;
}

const Conversation: React.FC<{ roomId: string | null }> = ({ roomId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');

  const { user } = useAuth();

  const userName = user?.name;
  useEffect(() => {
    socket.emit('joinRoom', { userName: userName, roomId: roomId });

    socket.on('message', (data: { userName: string; message: string }) => {
      console.log(data.message);
      setMessages(prevMessages => [
        ...prevMessages,
        { userName: data.userName, message: data.message },
      ]);
    });

    socket.on('joinedRoom', (room: string, userName: string) => {
      console.log(`Usuário ${userName} entrou na sala ${room}`);
    });

    return () => {
      socket.off('message');
      // socket.emit('leaveRoom', { username, room: roomId });
    };
  }, [userName, roomId]);

  const sendMessage = () => {
    console.log('Socket está conectado:', socket.connected);
    if (socket && roomId) {
      socket.emit('sendMessage', {
        roomId: roomId,
        message: newMessage,
        userName: userName,
      });
      setNewMessage('');
    }
  };

  function connect() {
    console.log('Connect Socket...');
    socket.connect();
  }

  function disconnect() {
    console.log('Disconnect Socket...');
    socket.disconnect();
  }

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
        <Button onClick={connect}>Connect Socket</Button>
        <Button onClick={disconnect}>Disconnect Socket</Button>
        <Input
          type="text"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          placeholder="Digite uma mensagem"
        />
        <Button onClick={sendMessage} type="primary" icon={<SendOutlined />} />
      </div>
    </div>
  );
};

export default Conversation;
