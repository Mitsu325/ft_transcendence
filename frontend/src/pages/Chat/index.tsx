import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Divider, Menu } from 'antd';
import ChatList from './ListCard/ChatList';
import WelcomeChat from './MessageCard/WelcomeChat';
import MessageList from './MessageCard/MessageList';
import 'pages/Chat/style.css';
import { socket } from 'socket';

type ChattingUser = {
  id: string;
  avatar: string;
  name: string;
  username?: string;
};

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
  const [selectedUser, setSelectedUser] = useState<ChattingUser | undefined>();

  const handleMenuClick = (key: string) => {
    setSelectedMenuItem(key);
    queryParams.set('menu', key);
    navigate(`?${queryParams.toString()}`);
  };

  const handleUserClick = (chattingUser?: ChattingUser) => {
    setSelectedUser(chattingUser);
  };

  useEffect(() => {
    const storedMenuItem = queryParams.get('menu') || 'channel';
    setSelectedMenuItem(storedMenuItem);
    if (storedMenuItem === 'chat') {
      socket.auth = { token: localStorage.getItem('token') };
      socket.connect();
    }

    return () => {
      socket.disconnect();
    };
  }, [queryParams]);

  const renderListComponent = () => {
    switch (selectedMenu) {
      case 'channel':
        return <h1>Channel</h1>;
      case 'chat':
        return (
          <ChatList
            handleUserClick={handleUserClick}
            selectedUser={selectedUser}
          />
        );
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
      return (
        <MessageList
          id={selectedUser.id}
          name={selectedUser.name}
          avatar={selectedUser.avatar}
        />
      );
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
