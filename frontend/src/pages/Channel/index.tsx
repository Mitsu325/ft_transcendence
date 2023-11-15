import React, { useState } from 'react';
import { Menu, Divider, Avatar } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import {
  UserOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { MenuInfo } from 'rc-menu/lib/interface';
import 'pages/Channel/style.css';

interface ChannelItemProps {
  id: string;
  name: string;
  type: 'public' | 'private' | 'protected';
}

const ChannelItem: React.FC<ChannelItemProps> = ({ name, type }) => {
  const getIconByType = (type: 'public' | 'private' | 'protected') => {
    switch (type) {
      case 'public':
        return <UserOutlined />;
      case 'private':
        return <LockOutlined />;
      case 'protected':
        return <SafetyCertificateOutlined />;
      default:
        return null;
    }
  };

  return (
    <div className="channel-item">
      <Avatar
        icon={getIconByType(type)}
        size={40}
        style={{ marginRight: '10px' }}
      />
      <div>
        <p>{name}</p>
        <small>{type}</small>
      </div>
    </div>
  );
};

const Channels: React.FC = () => {
  const [channels, setChannels] = useState<ChannelItemProps[]>([]);
  const [current, setCurrent] = useState('channel');

  const handleMenuClick = (e: MenuInfo) => {
    setCurrent(e.key as string);
  };

  const handleIconClick = () => {
    console.log('Ícone clicado!');

    const newChannel: ChannelItemProps = {
      id: '123',
      name: 'Novo Canal',
      type: 'public',
    };
    setChannels([...channels, newChannel]);
  };

  const menuItems = [
    {
      label: 'Canais',
      key: 'channel',
    },
    {
      label: 'Chats',
      key: 'chat',
    },
  ];

  return (
    <>
      <div className="channel-grid">
        <div className="channel">
          <Menu
            className="menu"
            onClick={handleMenuClick}
            selectedKeys={[current]}
            mode="horizontal"
            items={menuItems}
          />
          <Divider className="divider" />

          {current === 'channel' && (
            <div className="menu-channel">
              {channels.map(channel => (
                <ChannelItem key={channel.id} {...channel} />
              ))}
            </div>
          )}

          {current === 'chat' && (
            <div className="menu-chats">
              <p>Chat</p>
            </div>
          )}
        </div>

        <div className="chat">
          <div className="icon-container" onClick={handleIconClick}>
            <p className="text-icon">Criar canal</p>
            <PlusCircleOutlined className="plus-icon" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Channels;
