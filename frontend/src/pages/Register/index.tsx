import React, { useEffect, useState } from 'react';
import { EditOutlined, KeyOutlined } from '@ant-design/icons';
import { useAuth } from 'hooks/useAuth';
import AvatarCustom from 'components/Avatar';
import 'pages/Register/style.css';
import { Link } from 'react-router-dom';

const menuItems = [
  {
    key: 'profile-edit',
    path: '/profile/edit',
    icon: <EditOutlined />,
    label: 'Editar perfil',
  },
  {
    key: 'security-config',
    path: '/profile/security',
    icon: <KeyOutlined />,
    label: 'Segurança',
  },
];

export default function Register({ content }: { content: string }) {
  const { user } = useAuth();
  const [mdScreenBreakpoint, setMdScreenBreakpoint] = useState(
    window.innerWidth > 1450,
  );

  const updateMedia = () => {
    setMdScreenBreakpoint(window.innerWidth > 768);
  };

  useEffect(() => {
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  }, []);

  const listItems = menuItems.map(item => (
    <dt key={item.key} className="profile-menu-list-item">
      <Link to={item.path}>
        {item.icon}
        <span className="ml-8">{item.label}</span>
      </Link>
    </dt>
  ));

  const renderContent = () => {
    switch (content) {
      case 'profile-data':
        return (
          <>
            <h1 className="profile-title">{user?.name}</h1>
            <p className="profile-text">
              Username: {user?.username || 'Não definido'}
            </p>
            <p className="profile-text">E-mail: {user?.email}</p>
          </>
        );
      case 'profile-edit':
        return (
          <>
            <h1 className="profile-title">{user?.name}</h1>
            <h2>Editar perfil...</h2>
          </>
        );
      case 'security':
        return (
          <>
            <h1 className="profile-title">{user?.name}</h1>
            <h2>Configuração de senha, 2FA...</h2>
          </>
        );
      default:
        break;
    }
  };

  return (
    <div className="profile">
      <div className="profile-menu">
        <AvatarCustom
          src={user?.avatar || ''}
          size={mdScreenBreakpoint ? 240 : 120}
          className="avatar-pos gray-border"
        />
        <dl className="profile-menu-list">{listItems}</dl>
      </div>
      <div className="profile-content">{renderContent()}</div>
    </div>
  );
}
