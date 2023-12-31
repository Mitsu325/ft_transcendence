import React, { useEffect, useState } from 'react';
import { List, Input, Divider } from 'antd';
import UserListItem from 'components/List/UserListItem';
import { SearchProps } from 'antd/es/input';
import { chatService } from 'services/chat.api';
import FailureNotification from 'components/Notification/FailureNotification';
import { socket } from 'socket';

const { Search } = Input;

type ChattingUser = {
  id: string;
  avatar: string;
  name: string;
};

interface ChatListProps {
  selectedUser: ChattingUser | undefined;
  handleUserClick: (chattingUser?: ChattingUser) => void;
}

type Chat = {
  chatUser: {
    id: string;
    avatar: string;
    name: string;
    username?: string;
  };
  text: string;
  date: string;
};

export default function ChatList({
  handleUserClick,
  selectedUser,
}: ChatListProps) {
  const [chats, setChats] = useState<Chat[]>([]);

  const onSearch: SearchProps['onSearch'] = (value, _e, info) =>
    console.log(info?.source, value);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await chatService.getRecipients();
        setChats(res);
      } catch (error) {
        FailureNotification({
          message: 'Ops! Encontramos algumas falhas durante o processo',
          description:
            'Não foi possível carregar as informações. Verifique sua conexão e tente novamente',
        });
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    socket.on('message', ({ senderId, message }) => {
      setChats(prevChat => [
        {
          chatUser: message.senderUser,
          text: message.text,
          date: message.hour,
        },
        ...prevChat.filter(chat => chat.chatUser.id !== senderId),
      ]);
    });

    socket.on('send-message', ({ recipient, message }) => {
      setChats(prevChat => [
        {
          chatUser: recipient,
          text: message.text,
          date: message.hour,
        },
        ...prevChat.filter(chat => chat.chatUser.id !== recipient.id),
      ]);
    });

    () => {
      socket.off('message');
      socket.off('send-message');
    };
  }, []);

  return (
    <>
      <Search
        placeholder="Buscar"
        allowClear
        onSearch={onSearch}
        className="input-search mt-12 mb-1"
      />
      <Divider className="border-dark mt-12 mb-1" />
      <List
        className="chat-list scroll"
        itemLayout="horizontal"
        dataSource={chats}
        renderItem={item => (
          <UserListItem
            active={selectedUser?.id === item.chatUser.id}
            avatar={item.chatUser.avatar}
            title={item.chatUser.name}
            description={item.text}
            date={item.date}
            onUserClick={() => handleUserClick(item.chatUser)}
          />
        )}
      />
    </>
  );
}
