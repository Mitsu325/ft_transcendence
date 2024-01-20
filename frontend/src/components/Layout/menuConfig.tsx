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
      { key: '3', label: <Link to="/statistics">Estatísticas</Link> },
      { key: '4', label: <Link to="/historic">Histórico de Partidas</Link> },
    ],
  },
  { key: '5', label: 'Amigos', icon: <TeamOutlined /> },
  {
    key: '6',
    icon: <MessageOutlined />,
    label: <Link to="/message">Chat</Link>,
  },
];

export const menuPaths: MenuPaths = {
  '/': '0',
  '/game-options': '1',
  '/profile': '2',
  '/statistics': '3',
  '/historic': '4',
  '/message': '6',
};
