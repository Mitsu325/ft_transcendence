import React, { useState, useEffect } from 'react';
import { Input, Button, Divider } from 'antd';
import { SendOutlined, WechatOutlined } from '@ant-design/icons';
import { useAuth } from 'hooks/useAuth';
import { socket } from '../../Socket/Socket';
import { sendMessage, connect, disconnect } from '../../Socket/utilsSocket';
import { channelApi } from '../../services/channel.api';
import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import './style.css';

const { TextArea } = Input;
interface Message {
  userName: string;
  message: string;
  createdAt: string;
}

const Conversation: React.FC<{ roomId: string; nameChannel: string }> = ({
  roomId,
  nameChannel,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [groupedMessages, setGroupedMessages] = useState<{
    [date: string]: Message[];
  }>({});

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
    socket.on(
      'message',
      (data: { message: string; userName: string; createdAt: string }) => {
        setMessages(prevMessages => [
          ...prevMessages,
          {
            userName: data.userName,
            message: data.message,
            createdAt: data.createdAt,
          },
        ]);
      },
    );
    const getMessages = async () => {
      const msgData = await channelApi.getMessages(roomId);
      if (msgData) {
        const grouped: { [date: string]: Message[] } = {};

        for (const message of msgData) {
          const messageDate = new Date(message.createdAt);
          const formattedDate = messageDate.toLocaleDateString();
          if (!grouped[formattedDate]) {
            grouped[formattedDate] = [];
          }
          grouped[formattedDate].push({
            userName: message.userName,
            message: message.message,
            createdAt: message.createdAt,
          });
        }
        setGroupedMessages(grouped);
      }
    };

    getMessages();
    return () => {
      socket.off();
    };
  }, [roomId, userPlayer.name, messages]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = async () => {
    sendMessage(roomId, newMessage, userPlayer.name);

    await channelApi.createMessage({
      channel_id: String(roomId),
      sender_id: userPlayer.id,
      message: newMessage,
    });
    setNewMessage('');
  };

  return (
    <>
      <div className="icon">
        <WechatOutlined style={{ marginRight: '15px' }} />
        <p>{nameChannel}</p>
      </div>
      <div className="channel-card"></div>
      <Divider className="divider-ch" />
      <div className="chat-messages">
        {Object.keys(groupedMessages).map(formattedDate => (
          <div key={formattedDate}>
            <p className="date">{formattedDate}</p>
            {groupedMessages[formattedDate].map((data, index) => {
              const messageDate = new Date(data.createdAt);
              messageDate.setMinutes(
                messageDate.getMinutes() - messageDate.getTimezoneOffset(),
              );

              const formattedHour = messageDate.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div className="message-container" key={index}>
                  <div className="avatar">
                    <Avatar
                      size={40}
                      icon={<UserOutlined />}
                      src={
                        data.userName === userPlayer.name
                          ? userPlayer.avatar
                          : undefined
                      }
                      alt={data.userName}
                    />
                    <div className="username-container">
                      <p className="username">
                        <strong>{data.userName}</strong>
                      </p>
                    </div>
                    <p className="msg">{data.message}</p>
                  </div>
                  <div className="hour">
                    <span>{formattedHour}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div style={{ position: 'relative' }}>
        <TextArea
          style={{ borderRadius: '0', paddingRight: '2.8rem' }}
          autoSize={{ minRows: 2, maxRows: 6 }}
          placeholder="Escreva uma mensagem"
          value={newMessage}
          onChange={handleInputChange}
        />
        <Button
          className="send-button"
          type="primary"
          icon={<SendOutlined />}
          size={'middle'}
          onClick={handleSendMessage}
          disabled={!newMessage}
        />
      </div>
    </>
  );
};

export default Conversation;
