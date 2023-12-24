import React, { useEffect, useState } from 'react';
import { List, Input, Divider } from 'antd';
import UserListItem from 'components/List/UserListItem';
import { SearchProps } from 'antd/es/input';
import { chatService } from 'services/chat.api';
import FailureNotification from 'components/Notification/FailureNotification';

const { Search } = Input;

type ChattingUser = {
  id: string;
  avatar: string;
  name: string;
};

interface ChatListProps {
  handleUserClick: (chattingUser?: ChattingUser) => void;
}

type Chat = {
  chatUser: {
    id: string;
    avatar: string;
    name: string;
  };
  text: string;
  date: string;
};

export default function ChatList({ handleUserClick }: ChatListProps) {
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
