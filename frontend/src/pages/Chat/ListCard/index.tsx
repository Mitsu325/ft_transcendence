import React from 'react';
import { Divider, Menu } from 'antd';
import ChatList from './ChatList';

interface ListCardProps {
  selectedMenu: string;
  handleMenuClick: (key: string) => void;
  handleUserClick: (userId?: string) => void;
}

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

export default function ListCard({
  selectedMenu,
  handleMenuClick,
  handleUserClick,
}: ListCardProps) {
  const renderListComponent = () => {
    switch (selectedMenu) {
      case 'channel':
        return <h1>Channel</h1>;
      case 'chat':
        return <ChatList handleUserClick={handleUserClick} />;
      default:
        return null;
    }
  };

  return (
    <div className="card list-card">
      <Menu
        className="menu"
        items={menuItems}
        mode="horizontal"
        selectedKeys={[selectedMenu]}
        onClick={({ key }) => handleMenuClick(key)}
      />

      <Divider className="border-dark mb-1" />

      {renderListComponent()}
    </div>
  );
}
