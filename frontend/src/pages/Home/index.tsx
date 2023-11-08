import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { Breadcrumb } from 'antd';
import MyFooter from '../../components/Footer';
import RenderContent from './content';
import '../../pages/Home/style.css';
import {
  TeamOutlined,
  UserOutlined,
  HomeOutlined,
  MessageOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

const Dashboard: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenuKey, setSelectedMenuKey] = useState(['1']);

  const items = [
    { key: '0', label: 'Home', icon: <HomeOutlined /> },
    { key: '1', label: 'Opções de jogo', icon: <AppstoreOutlined /> },
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
        { key: '6', label: 'Enviar mensagem' },
        { key: '7', label: 'Gerenciar usuários' },
        { key: '8', label: 'Convidar para jogar' },
        { key: '9', label: 'Perfil de jogadores' },
      ],
    },
  ];

  const handleMenuClick = ({ key }: any) => {
    setSelectedMenuKey([key]);
  };

  const getMenuBreadcrumb = (itemKey: string): string[] => {
    const breadcrumbItems: string[] = [];
    const findMenuItem = (items: any[], key: string): any | undefined => {
      for (const item of items) {
        if (item.key === key) {
          return item;
        } else if (item.children) {
          const foundItem = findMenuItem(item.children, key);
          if (foundItem) {
            breadcrumbItems.push(item.label);
            return foundItem;
          }
        }
      }
      return undefined;
    };

    let selectedItem = findMenuItem(items, itemKey);
    if (selectedItem) {
      breadcrumbItems.push(selectedItem.label);
      while (selectedItem.key !== '1') {
        const parentItem = findMenuItem(items, selectedItem.parentKey);
        if (parentItem) {
          breadcrumbItems.push(parentItem.label);
          selectedItem = parentItem;
        } else {
          break;
        }
      }
    }
    return breadcrumbItems;
  };

  const breadcrumbItems = getMenuBreadcrumb(selectedMenuKey[0]);

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
        >
          {items.map(item => {
            if (item.children) {
              return (
                <SubMenu key={item.key} icon={item.icon} title={item.label}>
                  {item.children.map(child => (
                    <Menu.Item key={child.key}>{child.label}</Menu.Item>
                  ))}
                </SubMenu>
              );
            }
            return (
              <Menu.Item key={item.key} icon={item.icon}>
                {item.label}
              </Menu.Item>
            );
          })}
        </Menu>
      </Sider>

      <Header className="header"></Header>
      <Layout>
        <Content className="content">
          <Breadcrumb className="breadcrumb">
            {breadcrumbItems.map((item, index) => (
              <Breadcrumb.Item key={index}>{item}</Breadcrumb.Item>
            ))}
          </Breadcrumb>
          {RenderContent(items, selectedMenuKey[0])}
        </Content>

        <MyFooter />
      </Layout>
    </Layout>
  );
};

export default Dashboard;
