import React, { useState, useEffect } from 'react';
import { Input, Button, Divider } from 'antd';
import { SendOutlined, WechatOutlined } from '@ant-design/icons';
import { useAuth } from 'hooks/useAuth';
import { socket } from '../../Socket/Socket';
import { sendMessage, connect, disconnect } from '../../Socket/utilsSocket';
import { channelApi } from '../../services/channel.api';
import './style.css';
import { adminService } from 'services/admin.api';
import { ActionType } from 'interfaces/channel.interface';
import FailureNotification from 'components/Notification/FailureNotification';

const { TextArea } = Input;
interface Message {
  userName: string;
  message: string;
  createdAt: string;
}

interface memberAction {
  action: ActionType | '';
  expirationDate: Date | null;
}

const Conversation: React.FC<{
  roomId: string;
  nameChannel: string;
}> = ({ roomId, nameChannel }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [groupedMessages, setGroupedMessages] = useState<{
    [date: string]: Message[];
  }>({});
  const [memberAction, setMemberAction] = useState<memberAction>({
    action: '',
    expirationDate: null,
  });

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
    return () => {
      socket.off();
    };
  }, []);

  useEffect(() => {
    const getMessages = async () => {
      const msgData = await channelApi.getMessages(roomId);
      setMessages(msgData);
    };

    const getMemberAction = async () => {
      const memberAction = await adminService.getMemberAction(
        roomId,
        userPlayer.id,
      );
      setMemberAction(memberAction);
    };

    getMessages();
    getMemberAction();
  }, [roomId, userPlayer]);

  useEffect(() => {
    const grouped: { [date: string]: Message[] } = {};

    for (const message of messages) {
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
  }, [messages]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = async () => {
    if (memberAction.action) return;

    const res = await channelApi.createMessage({
      channel_id: String(roomId),
      sender_id: userPlayer.id,
      message: newMessage,
    });
    if (!res.success) {
      FailureNotification({
        message: 'Erro ao enviar mensagem',
        description: res.message,
      });
      if (res.data) {
        setMemberAction(res.data);
      }
      setNewMessage('');
      return;
    }
    sendMessage(
      roomId,
      newMessage,
      userPlayer.id,
      userPlayer.name,
      res.message.createdAt,
    );
    setNewMessage('');
  };

  return (
    <>
      <div className="icon">
        <WechatOutlined style={{ marginRight: '15px' }} />
        <p>{nameChannel}</p>
      </div>
      <Divider className="divider-ch" />

      <div className="chat-messages">
        {Object.keys(groupedMessages)
          .sort()
          .map(formattedDate => (
            <div key={formattedDate}>
              <p className="date">{formattedDate}</p>
              {groupedMessages[formattedDate].map((data, index) => {
                const messageDate = new Date(data.createdAt);
                const formattedHour = messageDate.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div className="message-container" key={index}>
                    <div className="avatar">
                      <div className="username-container">
                        <p className="username">
                          <strong>{data.userName}:</strong>
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
          disabled={memberAction.action === 'mute'}
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
