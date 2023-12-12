import React, { useState, useEffect } from 'react';
import { Input, Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { useAuth } from 'hooks/useAuth';
import { socket } from '../../Socket/Socket';
import { sendMessage, connect, disconnect } from '../../Socket/utilsSocket';
import { channelService } from '../../services/channel.api';
import './style.css';

interface Message {
  userName: string;
  message: string;
}

const Conversation: React.FC<{ roomId: string | null }> = ({ roomId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);

  const user = useAuth()?.user;

  const userPlayer = React.useMemo(() => {
    const newPlayer = {
      id: user?.id ?? '',
      name: user?.name ?? '',
      avatar: user?.avatar ?? null,
    };
    return newPlayer;
  }, [user]);

  useEffect(() => {
    if (!isConnected) {
      connect();
      setIsConnected(true);
    }
  }, [isConnected]);

  useEffect(() => {
    if (!user) {
      disconnect();
    }
  }, [user]);

  useEffect(() => {
    socket.on('message', (data: { message: string; userName: string }) => {
      console.log('Received message:', data);
      const existingMessage = messages.find(
        message => message.message === data.message,
      );
      if (existingMessage) {
        return;
      }
      setMessages(prevMessages => [
        ...prevMessages,
        { userName: data.userName, message: data.message },
      ]);
    });
    const getMessages = async () => {
      const msgData = await channelService.getMessages(roomId);
      if (msgData) {
        setMessages(msgData);
      }
    };

    getMessages();
    return () => {
      socket.off();
    };
  }, [roomId, userPlayer.name, messages]);

  const handleSendMessage = async () => {
    sendMessage(roomId, newMessage, userPlayer.name);

    await channelService.createMessage({
      channel_id: String(roomId),
      sender_id: user?.id ?? '',
      message: newMessage,
    });
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
