import React, { useEffect, useState } from 'react';
import 'pages/Friend/style.css';
import { Menu, MenuProps } from 'antd';
import { Link, useLocation } from 'react-router-dom';

const menuItems: MenuProps['items'] = [
  {
    label: <Link to="/friend">Amigos</Link>,
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
        return <h1>Amigos</h1>;
      case 'invite':
        return <h1>Convites pendentes</h1>;
      case 'invite-sent':
        return <h1>Convites enviados</h1>;
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
      <Menu
        className="friend-menu"
        items={menuItems}
        mode="horizontal"
        selectedKeys={[selectedMenu]}
      />
      {renderContent()}
    </>
  );
}
