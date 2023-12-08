import React, { useState } from 'react';
import { Divider, Menu } from 'antd';
import ChatList from './ChatList';

const menuItems = [
  {
    label: 'Canais',
    key: 'channel',
  },
  {
    label: 'Chats',
    key: 'chat',
  },
];

export default function ListCard() {
  const [selectedMenuItem, setSelectedMenuItem] = useState('channel');

  const handleMenuClick = ({ key }: { key: string }) => {
    setSelectedMenuItem(key);
  };

  const renderListComponent = () => {
    switch (selectedMenuItem) {
      case 'channel':
        return <h1>Channel</h1>;
      case 'chat':
        return <ChatList />;
      default:
        return null;
    }
  };

  return (
    <div className="card card-list">
      <Menu
        className="menu"
        items={menuItems}
        mode="horizontal"
        defaultSelectedKeys={['channel']}
        onClick={handleMenuClick}
      />

      <Divider className="border-dark mb-1" />

      {renderListComponent()}
    </div>
  );
}
