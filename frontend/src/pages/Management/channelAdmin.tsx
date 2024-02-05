import React, { useState } from 'react';
import { Button, Tooltip, Divider, Menu, MenuProps } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { channelApi } from 'services/channel.api';
import { Channel } from 'interfaces/channel.interface';
import FailureNotification from 'components/Notification/FailureNotification';
import SuccessNotification from 'components/Notification/SuccessNotification';
import AdminList from './Content/AdminList';
import PasswordModal from './PasswordModal';
import './style.css';
import AdminAction from './Content/AdminAction';

const menuItems: MenuProps['items'] = [
  {
    label: 'Admin',
    key: 'admin',
  },
  {
    label: 'Ações',
    key: 'actions',
  },
];

const ChannelAdmin: React.FC<Channel> = ({ channel, owner, hasAdmin }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [content, setContent] = useState('admin');

  const handleLeave = async () => {
    if (hasAdmin) {
      const res = await channelApi.updateOwner(channel.id);
      if (res.data.message == 'Success') {
        SuccessNotification({
          message: 'Saiu do canal',
          description: 'Você não é mais dono deste canal.',
        });
      }
    } else {
      FailureNotification({
        message: 'Não é possível sair do canal.',
        description: 'Adicione um administrador e tente novamente.',
      });
    }
  };

  const handlePassword = async () => {
    if (channel.type == 'Público' || channel.type == 'Privado') {
      setIsModalOpen(true);
    }
    if (channel.type == 'Protegido') {
      setOpenModal(true);
    }
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    setContent(key);
  };

  const renderContent = () => {
    switch (content) {
      case 'admin':
        return <AdminList channelId={channel.id} />;
      case 'actions':
        return <AdminAction channelId={channel.id} />;
      default:
        break;
    }
  };

  return (
    <>
      <div className="admin-header">
        <h2 className="sub-title">
          Dono do Canal: {channel.owner !== null ? channel.owner : ''} | Canal{' '}
          {channel.type}
        </h2>
        {owner && (
          <div>
            <Button className="pass-btn" onClick={() => handlePassword()}>
              Senha
            </Button>
            <Tooltip title="Sair do canal">
              <Button
                aria-label="Sair do canal"
                className="leave-btn"
                icon={<LogoutOutlined />}
                onClick={() => handleLeave()}
              />
            </Tooltip>
          </div>
        )}
      </div>
      <Divider style={{ margin: 0 }} />
      <Menu
        className="friend-menu"
        items={menuItems}
        mode="horizontal"
        defaultSelectedKeys={['admin']}
        onClick={handleMenuClick}
      />
      {renderContent()}
      <PasswordModal
        channel={channel.id}
        isModalOpen={isModalOpen}
        openModal={openModal}
        onCancel={() => {
          setIsModalOpen(false);
          setOpenModal(false);
        }}
      />
    </>
  );
};

export default ChannelAdmin;
