import React, { useEffect, useState } from 'react';
import { Divider, List } from 'antd';
import AvatarCustom from 'components/Avatar';
import MessageBox from 'components/Message/MessageBox';
import MessageInput from 'components/Message/MessageInput';
import { chatService } from 'services/chat.api';
import FailureNotification from 'components/Notification/FailureNotification';
import { socket } from 'socket';
import { useAuth } from 'hooks/useAuth';

type ChattingUser = {
  id: string;
  avatar: string;
  name: string;
  username?: string;
};

type DividerMessage = {
  type: 'divider';
  text: string;
};

type TextMessage = {
  id: string;
  type: 'text';
  text: string;
  senderUser: {
    id: string;
    avatar: string;
    name: string;
    username?: string;
  };
  hour: string;
};

type Message = DividerMessage | TextMessage;

// TODO: iniciar scroll de baixo para cima

export default function MessageList(selectedUser: ChattingUser) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await chatService.getMessagesFromChattingUser(
          selectedUser.id,
        );
        setMessages(res);
      } catch (error) {
        FailureNotification({
          message: 'Ops! Encontramos algumas falhas durante o processo',
          description:
            'Não foi possível carregar as informações. Verifique sua conexão e tente novamente',
        });
      }
    };

    fetchData();
  }, [selectedUser]);

  useEffect(() => {
    socket.on('message', ({ senderId, message }) => {
      if (user?.id !== selectedUser.id && senderId === selectedUser.id) {
        setMessages(prevMessages => [...prevMessages, message]);
      }
    });

    return () => {
      socket.off('message');
    };
  }, [selectedUser, user]);

  const renderComponent = (item: Message) => {
    if (item.type === 'text') {
      return (
        <MessageBox
          senderUser={item.senderUser}
          text={item.text}
          hour={item.hour}
        />
      );
    } else {
      return (
        <Divider
          style={{ fontSize: '0.8rem', color: '#5a5a5a', margin: '0' }}
          plain
        >
          {item.text}
        </Divider>
      );
    }
  };

  const sendMessage = (message: string) => {
    chatService
      .sendMessage({
        recipientId: selectedUser.id,
        message,
      })
      .then(res => {
        if (res) {
          setMessages([...messages, res]);
          socket.emit('message', {
            recipientId: selectedUser.id,
            message: res,
          });
          if (user?.id !== selectedUser.id) {
            socket.emit('send-message', {
              recipient: selectedUser,
              message: res,
            });
          }
        }
      })
      .catch(() => {
        FailureNotification({
          message: 'Ops! Não foi possível enviar a mensagem.',
          description: 'Verifique sua conexão e tente novamente',
        });
      });
  };

  return (
    <>
      <div className="message-header">
        <AvatarCustom src={selectedUser.avatar} size={48} />
        <h1 className="title ml-12">{selectedUser.name}</h1>
      </div>
      <Divider className="border-dark m-0" />
      <List
        className="message-list scroll"
        itemLayout="horizontal"
        dataSource={messages}
        renderItem={item => renderComponent(item)}
      />
      <Divider className="border-dark m-0" />
      <MessageInput handleClick={sendMessage} />
    </>
  );
}
