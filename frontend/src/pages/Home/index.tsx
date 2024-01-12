import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { Breadcrumb } from 'antd';
import RenderContent from 'pages/utils/RenderContent';
import getMenuBreadcrumb from 'pages/utils/GetMenu';
import 'pages/Home/style.css';
import {
  TeamOutlined,
  UserOutlined,
  HomeOutlined,
  MessageOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';

const { Header, Content, Sider } = Layout;

const Dashboard: React.FC = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [selectedMenuKey, setSelectedMenuKey] = useState(['0']);

  const items = [
    { key: '0', label: 'Home', icon: <HomeOutlined /> },
    { key: '1', label: 'Sala de Jogos', icon: <AppstoreOutlined /> },
    {
      key: 'sub1',
      label: 'Perfil do usuário',
      icon: <UserOutlined />,
      children: [
        { key: '2', label: 'Dados de cadastro' },
        { key: '3', label: 'Estatísticas' },
        { key: '4', label: 'Histórico de partidas' },
      ],
    },
    { key: '5', label: 'Amigos', icon: <TeamOutlined /> },
    {
      key: 'sub2',
      label: 'Chat',
      icon: <MessageOutlined />,
      children: [
        { key: '6', label: 'Criar chat' },
        { key: '7', label: 'Enviar mensagem' },
        { key: '8', label: 'Gerenciar usuários' },
        { key: '9', label: 'Perfil de jogadores' },
      ],
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    setSelectedMenuKey([key]);
  };

  const breadcrumbItems = getMenuBreadcrumb(selectedMenuKey[0], items);

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
          items={items}
        />
      </Sider>

      <Header className="header"></Header>
      <Layout>
        <Content className="content">
          <Breadcrumb className="breadcrumb" items={breadcrumbItems} />
          {RenderContent(items, selectedMenuKey[0])}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
