import React, { useEffect, useState } from 'react';
import {
  Link,
  Outlet,
  createSearchParams,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { Button, Layout, Menu, Modal, Tooltip } from 'antd';
import {
  AlertOutlined,
  AppstoreOutlined,
  FlagOutlined,
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
import { friendSocket } from 'socket';
import { userNonSensitiveInfo } from 'interfaces/userModel';

const { Header, Content, Sider } = Layout;

const CommonLayout = () => {
  const { user, Logout } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const [selectedMenuKey, setSelectedMenuKey] = useState(['']);
  const [modal, contextHolder] = Modal.useModal();
  const navigate = useNavigate();

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

  const handleOk = (sender: userNonSensitiveInfo) => {
    const path = {
      pathname: '/game-options',
      search: createSearchParams({ hostId: sender.id }).toString(),
    };
    navigate(path);
  };

  const handleCancel = (sender: userNonSensitiveInfo) => {
    friendSocket.emit('decline-invite', {
      sender,
      recipient: {
        id: user?.id,
        name: user?.name,
        username: user?.username,
        avatar: user?.avatar,
      },
    });
  };

  const closeWarningModal = () => {
    const path = {
      pathname: '/game-options',
      search: createSearchParams({ cleanRoom: 'true' }).toString(),
    };
    navigate(path);
    Modal.destroyAll();
  };

  useEffect(() => {
    friendSocket.auth = { token: localStorage.getItem('token') };
    friendSocket.connect();

    friendSocket.on('invite-play', ({ sender }) => {
      modal.confirm({
        title: 'Você recebeu um convite para jogar Pong!',
        icon: <FlagOutlined />,
        content: `Aceite o desafio de ${sender?.name} e divirta-se em uma emocionante partida.`,
        okText: 'Aceitar',
        cancelText: 'Recusar',
        onOk: () => handleOk(sender),
        onCancel: () => handleCancel(sender),
      });
    });

    friendSocket.on('decline-invite', ({ recipient }) => {
      modal.warning({
        title: 'Convite Recusado',
        icon: <AlertOutlined />,
        content: `Infelizmente, ${recipient?.name} recusou o convite para jogar. Sem problemas, você sempre pode convidá-lo novamente para uma partida mais tarde!`,
        okText: 'Fechar sala do jogo',
        onOk: closeWarningModal,
      });
    });

    return () => {
      friendSocket.off('invite-play');
      friendSocket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <>
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
        <Content className="content">
          <Outlet />
        </Content>
      </Layout>
      {contextHolder}
    </>
  );
};

export default CommonLayout;
