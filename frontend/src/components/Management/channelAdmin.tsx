import React, { useState, useEffect } from 'react';
import { Card, Row, Col, List, Avatar, Button, Drawer, Tooltip } from 'antd';
import { userService } from '../../services/user.api';
import { adminService } from 'services/admin.api';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { channelApi } from '../../services/channel.api';
import FailureNotification from 'components/Notification/FailureNotification';
import SuccessNotification from 'components/Notification/SuccessNotification';
import { useAuth } from '../../hooks/useAuth';

interface ChannelAdminProps {
  id: string;
  name_channel: string;
  type: string;
  owner: string | null;
}

interface Channel {
  channel: ChannelAdminProps;
  owner: boolean;
}

interface User {
  id: string;
  name: string;
  username: string;
}

interface Admin {
  id: string;
  channel_id: string;
  admin_id: string;
  active: boolean;
}

const ChannelAdmin: React.FC<Channel> = ({ channel, owner }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);

  // const userAvatar = useAuth()?.user;
  const user = useAuth()?.user;

  const userPlayer = React.useMemo(() => {
    const newPlayer = {
      id: user?.id ?? '',
      name: user?.name ?? '',
      avatar: user?.avatar ?? null,
    };
    return newPlayer;
  }, [user]);

  useEffect(() => {
    const getUsers = async () => {
      const data = await userService.getAllUsers();
      setUsers(data);
    };

    getUsers();
  }, []);

  useEffect(() => {
    const getAdmins = async () => {
      const data = await adminService.getAdmins(channel.id);
      setAdmins(data);
    };

    getAdmins();
  }, [channel.id, admins]);

  const showDrawer = (user: User) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const onClose = () => {
    setSelectedUser(null);
    setOpen(false);
  };

  const addAdmin = async () => {
    try {
      if (selectedUser) {
        const ret = await adminService.addAdmin({
          channel_id: channel.id,
          admin_id: selectedUser.id,
          active: true,
        });
        if (ret.success) {
          SuccessNotification({
            message: 'Ok',
            description: 'Adminstrador adicionado com sucesso',
          });
        } else {
          FailureNotification({
            message: 'Erro',
            description:
              'Erro ao adicionar administrador. Já adicionado e ativo.',
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const removeAdmin = async () => {
    try {
      if (selectedUser) {
        const ret = await adminService.removeAdmin({
          channel_id: channel.id,
          admin_id: selectedUser.id,
        });
        if (ret.success) {
          SuccessNotification({
            message: 'Ok',
            description: 'Adminstrador removido com sucesso',
          });
        } else {
          FailureNotification({
            message: 'Erro',
            description: 'Administrador já removido ou inativo',
          });
        }
      }
    } catch (error) {
      console.error('Erro ao remover administrador:', error);
      console.log('Erro ao remover administrador. Tente novamente mais tarde.');
    }
  };

  const handleLeave = async () => {
    if (admins && admins.length > 0) {
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

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span
            style={{ marginRight: '18px', color: '#001529' }}
          >{`Dono do Canal: ${
            channel.owner !== null ? channel.owner : ''
          }`}</span>
          {owner && (
            <Tooltip title="Sair do canal">
              <Button
                aria-label="Sair do canal"
                className="leaveChnBtn"
                icon={<LogoutOutlined />}
                onClick={() => handleLeave()}
              />
            </Tooltip>
          )}
        </div>
      }
    >
      <Row gutter={16}>
        <Col span={12}>
          <List
            header={
              <div className="text-title">
                Administradores do Canal:{' '}
                <strong>{channel.name_channel}</strong>
              </div>
            }
            dataSource={admins}
            renderItem={admin => (
              <List.Item>
                <List.Item.Meta
                  className="text-title"
                  avatar={
                    admin.id === userPlayer.id && userPlayer.avatar ? (
                      <Avatar size={50} src={userPlayer.avatar} />
                    ) : (
                      <Avatar
                        size={50}
                        icon={<UserOutlined className="userOutlined" />}
                      />
                    )
                  }
                  title={admin.admin_id}
                  description={`@${admin.admin_id}`}
                />
              </List.Item>
            )}
          />
        </Col>

        <Col span={12}>
          <List
            header={<div className="text-title">Usuários</div>}
            dataSource={users}
            renderItem={user => (
              <List.Item
                onClick={() => {
                  showDrawer(user);
                }}
                style={{ cursor: 'pointer' }}
              >
                <List.Item.Meta
                  className="text-title"
                  avatar={
                    user.id === userPlayer.id && userPlayer.avatar ? (
                      <Avatar size={50} src={userPlayer.avatar} />
                    ) : (
                      <Avatar
                        size={50}
                        icon={<UserOutlined className="userOutlined" />}
                      />
                    )
                  }
                  title={user.name}
                  description={`@${user.username}`}
                />
              </List.Item>
            )}
          />
        </Col>
      </Row>

      <Drawer
        title="Gerenciar"
        placement="right"
        onClose={onClose}
        open={open}
        getContainer={false}
      >
        <Button
          key="addAdmin"
          type="primary"
          onClick={addAdmin}
          style={{ marginBottom: '10px' }}
        >
          Adicionar como administrador
        </Button>
        <Button
          key="removeAdmin"
          type="primary"
          onClick={removeAdmin}
          style={{ marginBottom: '10px' }}
        >
          Remover administrador
        </Button>
      </Drawer>
    </Card>
  );
};

export default ChannelAdmin;
