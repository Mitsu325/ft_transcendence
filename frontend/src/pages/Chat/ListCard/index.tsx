import React, { useEffect, useMemo, useState } from 'react';
import { Divider, Menu } from 'antd';
import ChatList from './ChatList';
import { useLocation, useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );
  const [selectedMenuItem, setSelectedMenuItem] = useState(
    queryParams.get('menu') || 'channel',
  );

  const handleMenuClick = ({ key }: { key: string }) => {
    setSelectedMenuItem(key);
    queryParams.set('menu', key);
    navigate(`?${queryParams.toString()}`);
  };

  useEffect(() => {
    const storedMenuItem = queryParams.get('menu') || 'channel';
    setSelectedMenuItem(storedMenuItem);
  }, [queryParams]);

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
        selectedKeys={[selectedMenuItem]}
        onClick={handleMenuClick}
      />

      <Divider className="border-dark mb-1" />

      {renderListComponent()}
    </div>
  );
}
