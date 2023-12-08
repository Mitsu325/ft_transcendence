import React from 'react';
import { List } from 'antd';
import UserListItem from 'components/List/UserListItem';

const data = [
  {
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    title: 'Mona',
    description: 'Hey!!',
  },
  {
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36',
    title: 'José',
    description: 'Maio',
  },
  {
    avatar: '',
    title: 'Patrícia',
    description: 'Hello',
  },
];

// TODO: description deve ser truncado do back a partir de determinada qtd de caracteres
// TODO: ao clicar no item precisa abrir o card de mensagem

export default function ChatList() {
  return (
    <>
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={item => (
          <UserListItem
            avatar={item.avatar}
            title={item.title}
            description={item.description}
          />
        )}
      />
    </>
  );
}
