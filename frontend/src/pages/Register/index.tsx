import React, { useEffect, useState } from 'react';
import { EditOutlined, KeyOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from 'hooks/useAuth';
import AvatarCustom from 'components/Avatar';
import UserProfileData from './Content/profileData';
import UserSecurity from './Content/security';
import UserEditProfile from './Content/Edit/editProfile';
import 'pages/Register/style.css';

const menuItems = [
  {
    key: 'profile-data',
    path: '/profile',
    icon: <UserOutlined />,
    label: 'Perfil',
  },
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
    window.innerWidth > 768,
  );
  const [activeIndex, setActiveIndex] = useState(-1);
  const { pathname } = useLocation();

  const updateMedia = () => {
    setMdScreenBreakpoint(window.innerWidth > 768);
  };

  useEffect(() => {
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  }, []);

  useEffect(() => {
    setActiveIndex(menuItems.findIndex(item => item.path === pathname));
  }, [pathname]);

  const listItems = menuItems.map((item, index) => {
    return (
      <dt
        key={item.key}
        className={
          'profile-menu-list-item' +
          (activeIndex === index ? ' list-item-active' : '')
        }
      >
        <Link to={item.path}>
          {item.icon}
          <span className="ml-8">{item.label}</span>
        </Link>
      </dt>
    );
  });

  const renderContent = () => {
    switch (content) {
      case 'profile-data':
        return <UserProfileData />;
      case 'profile-edit':
        return <UserEditProfile />;
      case 'security':
        return <UserSecurity />;
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
