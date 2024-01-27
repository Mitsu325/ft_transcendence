import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Button, Layout, Menu, Tooltip } from 'antd';
import {
  AppstoreOutlined,
  HomeOutlined,
  LogoutOutlined,
  MessageOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { menuPaths } from 'components/Layout/menuConfig';
import AvatarCustom from 'components/Avatar';
import SuccessNotification from 'components/Notification/SuccessNotification';
import FailureNotification from 'components/Notification/FailureNotification';
import { useAuth } from 'hooks/useAuth';
import { isTokenExpired } from 'utils/jwt-decode';
import 'components/Layout/style.css';

const { Header, Content, Sider } = Layout;

const CommonLayout = () => {
  const { user, Logout } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const [selectedMenuKey, setSelectedMenuKey] = useState(['']);

  const menuItems = [
    { key: '0', icon: <HomeOutlined />, label: <Link to="/">Home</Link> },
    {
      key: '1',
      icon: <AppstoreOutlined />,
      label: <Link to="/game-options">Opções de jogo</Link>,
    },
    {
      key: 'sub1',
      label: 'Perfil do usuário',
      icon: <UserOutlined />,
      children: [
        {
          key: '2',
          label: <Link to={'/profile/' + user?.username}>Perfil</Link>,
        },
        { key: '3', label: <Link to="/statistics">Estatísticas</Link> },
        { key: '4', label: <Link to="/historic">Histórico de partidas</Link> },
      ],
    },
    {
      key: '5',
      label: <Link to="/friend">Amigos</Link>,
      icon: <TeamOutlined />,
    },
    {
      key: 'sub2',
      label: 'Chat',
      icon: <MessageOutlined />,
      children: [
        { key: '6', label: <Link to="/message">Chat</Link> },
        { key: '7', label: <Link to="/manager">Gerenciamento</Link> },
      ],
    },
  ];

  useEffect(() => {
    if (!loading && isTokenExpired()) {
      FailureNotification({
        message: 'Sessão encerrada',
        description: 'Por favor, faça login novamente.',
      });
      Logout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const path = location.pathname;
    const key = menuPaths[path.split('/').slice(0, 2).join('/')];

    if (key) {
      setSelectedMenuKey([key]);
    } else {
      setSelectedMenuKey(['0']);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleMenuClick = ({ key }: { key: string }) => {
    setSelectedMenuKey([key]);
  };

  const onLogout = () => {
    setLoading(true);
    SuccessNotification({
      message: 'Sessão encerrada',
      description: 'A sua sessão foi encerrada.',
    });
    Logout();
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className="header align-end">
        <div className="header-user-info">
          <p className="mr-8">{user?.name}</p>
          <AvatarCustom src={user?.avatar || ''} size={40} />
        </div>
      </Header>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={value => setCollapsed(value)}
        style={{ marginTop: 64 }}
      >
        <Menu
          theme="dark"
          selectedKeys={selectedMenuKey}
          mode="inline"
          onClick={handleMenuClick}
          items={menuItems}
        />
        <Tooltip title="Sair da conta" placement="right" color="blue">
          <Button
            aria-label="Sair da conta"
            className="logout-btn"
            icon={<LogoutOutlined />}
            loading={loading}
            onClick={() => onLogout()}
          />
        </Tooltip>
      </Sider>
      <Layout>
        <Content className="content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default CommonLayout;
