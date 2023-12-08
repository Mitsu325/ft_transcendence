import React, { useState, useEffect } from 'react';
import { Input, Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { useAuth } from 'hooks/useAuth';
import { socket } from '../../Socket/Socket';
import { sendMessage, connect } from '../../Socket/utilsSocket';
import { channelService } from '../../services/channel.api';
import './style.css';

interface Message {
  userName: string;
  message: string;
}

const Conversation: React.FC<{ roomId: string | null }> = ({ roomId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [sender, setSender] = useState<string>('');
  const { user } = useAuth();
  const userName = user?.name ?? '';

  useEffect(() => {
    connect();

    socket.on('message', (data: { userName: string; message: string }) => {
      // console.log(data.message);
      // console.log(data.userName);
      setMessages(prevMessages => [
        ...prevMessages,
        { userName: data.userName, message: data.message },
      ]);
    });
    const getMessages = async () => {
      const msgData = await channelService.getMessages(roomId);
      if (msgData) {
        console.log(msgData);
        console.log(msgData.message);
        setSender(msgData.sender_id);
        setMessages(msgData);
      }
    };

    getMessages();
  }, [roomId, userName]);

  const handleSendMessage = async () => {
    sendMessage(roomId, newMessage, userName);

    await channelService.createMessage({
      channel_id: String(roomId),
      sender_id: user?.id ?? '',
      message: newMessage,
    });

    const updatedMessages = await channelService.getMessages(roomId);
    if (updatedMessages) {
      console.log(updatedMessages);
      setSender(updatedMessages.sender_id);
      setMessages(updatedMessages.message);
    }
    console.log(updatedMessages);
    setNewMessage('');
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((data, index) => (
          <p className="chat-p" key={index}>
            <strong>{sender}:</strong> {data.message}
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
