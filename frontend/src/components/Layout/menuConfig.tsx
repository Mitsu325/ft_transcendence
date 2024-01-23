import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  AppstoreOutlined,
  HomeOutlined,
  MessageOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';

export type BreadcrumbItem = {
  title: ReactNode;
};

type MenuPaths = {
  [key: string]: string;
};

export const menuItems = [
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
      { key: '2', label: <Link to="/profile">Dados de cadastro</Link> },
      { key: '3', label: 'Estatísticas' },
      { key: '4', label: 'Histórico de partidas' },
    ],
  },
  { key: '5', label: 'Amigos', icon: <TeamOutlined /> },
  {
    key: 'sub2',
    label: 'Canais e chat',
    icon: <MessageOutlined />,
    children: [
      { key: '6', label: <Link to="/message">Chat</Link> },
      { key: '7', label: <Link to="/manager">Gerenciamento</Link> },
    ],
  },
];

export const menuPaths: MenuPaths = {
  '/': '0',
  '/game-options': '1',
  '/profile': '2',
  '/message': '6',
  '/manager': '7',
};
