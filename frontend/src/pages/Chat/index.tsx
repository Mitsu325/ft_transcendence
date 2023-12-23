import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Divider, Menu } from 'antd';
import ChatList from './ListCard/ChatList';
import WelcomeChat from './MessageCard/WelcomeChat';
import MessageList from './MessageCard/MessageList';
import 'pages/Chat/style.css';

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

export default function Chat() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );
  const [selectedMenu, setSelectedMenuItem] = useState(
    queryParams.get('menu') || 'channel',
  );
  const [selectedUser, setSelectedUser] = useState<string | undefined>();

  const handleMenuClick = (key: string) => {
    setSelectedMenuItem(key);
    queryParams.set('menu', key);
    navigate(`?${queryParams.toString()}`);
  };

  const handleUserClick = (userId?: string) => {
    setSelectedUser(userId);
  };

  useEffect(() => {
    const storedMenuItem = queryParams.get('menu') || 'channel';
    setSelectedMenuItem(storedMenuItem);
  }, [queryParams]);

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

  const renderMessageComponent = () => {
    if (selectedMenu === 'channel') {
      return <h1>Channel</h1>;
    } else {
      if (!selectedUser) {
        return <WelcomeChat />;
      }
      return <MessageList selectedUser={selectedUser} />;
    }
  };

  return (
    <div className="channel-grid">
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
      <div className="card message-card">{renderMessageComponent()}</div>
    </div>
  );
}
