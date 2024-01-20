import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Breadcrumb, Button, Layout, Menu, Tooltip } from 'antd';
import getMenuBreadcrumb from 'pages/utils/GetMenu';
import {
  BreadcrumbItem,
  menuItems,
  menuPaths,
} from 'components/Layout/menuConfig';
import 'components/Layout/style.css';
import { useAuth } from 'hooks/useAuth';
import AvatarCustom from 'components/Avatar';
import { LogoutOutlined } from '@ant-design/icons';
import SuccessNotification from 'components/Notification/SuccessNotification';
import { isTokenExpired } from 'utils/jwt-decode';
import FailureNotification from 'components/Notification/FailureNotification';

const { Header, Content, Sider } = Layout;

const CommonLayout = () => {
  const { user, Logout } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const [selectedMenuKey, setSelectedMenuKey] = useState(['']);
  const [breadcrumbItems, setBreadcrumbItems] = useState<BreadcrumbItem[]>([]);

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
    const key = menuPaths[path];

    if (key) {
      setSelectedMenuKey([key]);
      const updatedBreadcrumbItems = getMenuBreadcrumb(key, menuItems);
      setBreadcrumbItems(updatedBreadcrumbItems);
    } else {
      setSelectedMenuKey(['0']);
    }
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
          <Breadcrumb className="breadcrumb" items={breadcrumbItems} />
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default CommonLayout;
