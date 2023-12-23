import React from 'react';
import { List, Input, Divider } from 'antd';
import UserListItem from 'components/List/UserListItem';
import { SearchProps } from 'antd/es/input';

const { Search } = Input;

interface ChatListProps {
  handleUserClick: (userId?: string) => void;
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

const data: Chat[] = [
  {
    chatUser: {
      id: 'abc',
      name: 'Mona',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    },
    text: 'Hey!!',
    date: '10:30',
  },
  {
    chatUser: {
      id: 'abc',
      name: 'Pedro',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36',
    },
    text: 'Maio',
    date: '08:30',
  },
  {
    chatUser: {
      id: 'abc',
      name: 'Patrícia',
      avatar: '',
    },
    text: 'Maiofd fdafadfadfadfdafafdaffafafdfdaf',
    date: '22/12/2023',
  },
];

export default function ChatList({ handleUserClick }: ChatListProps) {
  const onSearch: SearchProps['onSearch'] = (value, _e, info) =>
    console.log(info?.source, value);

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
        dataSource={data}
        renderItem={item => (
          <UserListItem
            avatar={item.chatUser.avatar}
            title={item.chatUser.name}
            description={item.text}
            date={item.date}
            onUserClick={() => handleUserClick(item.chatUser.id)}
          />
        )}
      />
    </>
  );
}
