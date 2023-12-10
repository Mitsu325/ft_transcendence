import React from 'react';
import { List } from 'antd';
import UserListItem from 'components/List/UserListItem';

interface ChatListProps {
  handleUserClick: (userId?: string) => void;
}

// TODO: falta pasasr a data e exibi-lá
const data = [
  {
    id: 'abc',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    name: 'Mona',
    description: 'Hey!!',
  },
  {
    id: 'def',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36',
    name: 'José',
    description: 'Maio',
  },
  {
    id: 'ghi',
    avatar: '',
    name: 'Patrícia',
    description: 'Hello',
  },
];

// TODO: description deve ser truncado do back a partir de determinada qtd de caracteres

export default function ChatList({ handleUserClick }: ChatListProps) {
  return (
    <>
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={item => (
          <UserListItem
            avatar={item.avatar}
            title={item.name}
            description={item.description}
            onUserClick={() => handleUserClick(item.id)}
          />
        )}
      />
    </>
  );
}
