import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Breadcrumb, Layout, Menu } from 'antd';
import getMenuBreadcrumb from 'pages/utils/GetMenu';
import {
  BreadcrumbItem,
  menuItems,
  menuPaths,
} from 'components/Layout/menuConfig';
import 'components/Layout/style.css';

const { Header, Content, Sider } = Layout;

const CommonLayout = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(true);
  const [selectedMenuKey, setSelectedMenuKey] = useState(['']);
  const [breadcrumbItems, setBreadcrumbItems] = useState<BreadcrumbItem[]>([]);

  const handleMenuClick = ({ key }: { key: string }) => {
    setSelectedMenuKey([key]);
  };

  useEffect(() => {
    const path = location.pathname;
    const key = menuPaths[path];

    if (key) {
      setSelectedMenuKey([key]);
      const updatedBreadcrumbItems = getMenuBreadcrumb(key, menuItems);
      setBreadcrumbItems(updatedBreadcrumbItems);
    }
  }, [location.pathname]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
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
      </Sider>

      <Header className="header"></Header>
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
