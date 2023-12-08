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

export const menuPaths: MenuPaths = {
  '/': '0',
  '/game-options': '1',
};
