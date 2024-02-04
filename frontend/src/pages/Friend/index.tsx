import React, { useEffect, useState } from 'react';
import 'pages/Friend/style.css';
import { Menu, MenuProps } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import FriendList from './Content/FriendList';
import InviteReceivedList from './Content/InviteReceivedList';
import InviteSentList from './Content/InviteSentList';
import FriendInvite from './Content/Invite';

const menuItems: MenuProps['items'] = [
  {
    label: <Link to="/friend">Todos</Link>,
    key: 'friend',
  },
  {
    label: <Link to="/friend/invite/received">Pendente</Link>,
    key: 'invite-received',
  },
  {
    label: <Link to="/friend/invite/sent">Enviado</Link>,
    key: 'invite-sent',
  },
  {
    label: <Link to="/friend/invite">Convidar</Link>,
    key: 'invite',
  },
];

export default function Friend({ content }: { content: string }) {
  const { pathname } = useLocation();
  const [selectedMenu, setSelectedMenu] = useState('');

  const renderContent = () => {
    switch (content) {
      case 'friend':
        return <FriendList />;
      case 'invite-received':
        return <InviteReceivedList />;
      case 'invite-sent':
        return <InviteSentList />;
      case 'invite':
        return <FriendInvite />;
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
      case '/friend/invite/received':
        setSelectedMenu('invite-received');
        break;
      default:
        break;
    }
  }, [pathname]);

  return (
    <>
      <h1 className="title">Amigos</h1>
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
