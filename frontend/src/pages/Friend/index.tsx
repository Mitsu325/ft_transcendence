import React, { useEffect, useState } from 'react';
import 'pages/Friend/style.css';
import { Menu, MenuProps } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import FriendList from './Content/FriendList';
import InviteReceivedList from './Content/InviteReceivedList';
import InviteSentList from './Content/InviteSentList';

const menuItems: MenuProps['items'] = [
  {
    label: <Link to="/friend">Todos</Link>,
    key: 'friend',
  },
  {
    label: <Link to="/friend/invite">Pendente</Link>,
    key: 'invite',
  },
  {
    label: <Link to="/friend/invite/sent">Enviado</Link>,
    key: 'invite-sent',
  },
];

export default function Friend({ content }: { content: string }) {
  const { pathname } = useLocation();
  const [selectedMenu, setSelectedMenu] = useState('');

  const renderContent = () => {
    switch (content) {
      case 'friend':
        return <FriendList />;
      case 'invite':
        return <InviteReceivedList />;
      case 'invite-sent':
        return <InviteSentList />;
      default:
        break;
    }
  };

  useEffect(() => {
    switch (pathname) {
      case '/friend':
        setSelectedMenu('friend');
        break;
      case '/friend/invite':
        setSelectedMenu('invite');
        break;
      case '/friend/invite/sent':
        setSelectedMenu('invite-sent');
        break;
      default:
        break;
    }
  }, [pathname]);

  return (
    <>
      <h1 className="friend-title">Amigos</h1>
      <div className="friend-content">
        <Menu
          className="friend-menu"
          items={menuItems}
          mode="horizontal"
          selectedKeys={[selectedMenu]}
        />
        {renderContent()}
      </div>
    </>
  );
}
