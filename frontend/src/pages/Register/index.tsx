import React, { useEffect, useState } from 'react';
import {
  EditOutlined,
  KeyOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useAuth } from 'hooks/useAuth';
import AvatarCustom from 'components/Avatar';
import UserProfileData from './Content/profileData';
import UserSecurity from './Content/Security/security';
import UserEditProfile from './Content/Edit/editProfile';
import 'pages/Register/style.css';
import UserModel from 'interfaces/userModel';
import { userService } from 'services/user.api';
import FailureNotification from 'components/Notification/FailureNotification';
import BlockUsers from './Content/blockUsers';

export default function Register({ content }: { content: string }) {
  const { user } = useAuth();
  const { username: usernameParam } = useParams();
  const [mdScreenBreakpoint, setMdScreenBreakpoint] = useState(
    window.innerWidth > 768,
  );
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showList, setShowList] = useState(false);
  const [userProfile, setUserProfile] = useState<UserModel | null>(null);
  const { pathname } = useLocation();
  const menuItems = [
    {
      key: 'profile-data',
      path: `/profile/${user?.username}`,
      icon: <UserOutlined />,
      label: 'Perfil',
    },
    {
      key: 'profile-edit',
      path: `/profile/${user?.username}/edit`,
      icon: <EditOutlined />,
      label: 'Editar perfil',
    },
    {
      key: 'security-config',
      path: `/profile/${user?.username}/security`,
      icon: <KeyOutlined />,
      label: 'Segurança',
    },
    {
      key: 'blocked-users',
      path: `/profile/${user?.username}/blocked-users`,
      icon: <TeamOutlined />,
      label: 'Bloqueados',
    },
  ];

  const updateMedia = () => {
    setMdScreenBreakpoint(window.innerWidth > 768);
  };

  useEffect(() => {
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  }, []);

  useEffect(() => {
    setActiveIndex(menuItems.findIndex(item => item.path === pathname));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (user?.username === usernameParam) {
      setShowList(true);
      setUserProfile(user);
    } else {
      setShowList(false);
      userService
        .getUserByUsername(usernameParam || '')
        .then(res => {
          setUserProfile(res);
        })
        .catch(() => {
          FailureNotification({
            message:
              'Ops! Parece que houve um problema ao carregar as informações do perfil.',
            description:
              'Verifique sua conexão com a internet e tente novamente.',
          });
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usernameParam, user?.username]);

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
        return <UserProfileData userProfile={userProfile} />;
      case 'profile-edit':
        return <UserEditProfile userProfile={userProfile} />;
      case 'security':
        return <UserSecurity userProfile={userProfile} />;
      case 'blocked-users':
        return <BlockUsers userProfile={userProfile} />;
      default:
        break;
    }
  };

  return (
    <div className="profile">
      <div className="profile-menu">
        <AvatarCustom
          src={userProfile?.avatar || ''}
          size={mdScreenBreakpoint ? 240 : 120}
          className="avatar-pos gray-border"
        />
        {showList && <dl className="profile-menu-list">{listItems}</dl>}
      </div>
      <div className="profile-content">{renderContent()}</div>
    </div>
  );
}
