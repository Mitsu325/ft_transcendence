import React, { useState, useEffect } from 'react';
import { Card, Row, Col, List, Avatar, Modal, Button } from 'antd';
import { userService } from '../../services/user.api';
import { adminService } from 'services/admin.api';
import { UserOutlined } from '@ant-design/icons';

interface ChannelAdminProps {
  id: string;
  name_channel: string;
  type: string;
  owner: string;
}

interface Channel {
  channel: ChannelAdminProps;
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

const ChannelAdmin: React.FC<Channel> = ({ channel }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

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
      console.log(data);
    };

    getAdmins();
  }, [channel.id]);

  const addAdmin = async () => {
    try {
      if (selectedUser) {
        await adminService.addAdmin({
          channel_id: channel.id,
          admin_id: selectedUser.id,
          active: true,
        });

        console.log(
          `Usuário ${selectedUser.name} adicionado como administrador.`,
        );

        setSelectedUser(null);
      }
    } catch (error) {
      console.error('Erro ao adicionar administrador:', error);
      console.log(
        'Erro ao adicionar administrador. Tente novamente mais tarde.',
      );
    }
  };

  return (
    <Card title={`Dono do Canal: ${channel.owner}`}>
      <Row gutter={16}>
        <Col span={12}>
          <List
            header={
              <div>
                Administradores do Canal:{' '}
                <strong>{channel.name_channel}</strong>
              </div>
            }
            dataSource={admins}
            renderItem={admin => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={admin.admin_id}
                  description={`@${admin.admin_id}`}
                />
              </List.Item>
            )}
          />
        </Col>

        <Col span={12}>
          <List
            header={<div>Usuários</div>}
            dataSource={users}
            renderItem={user => (
              <List.Item
                onClick={() => setSelectedUser(user)}
                style={{ cursor: 'pointer' }}
              >
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={user.name}
                  description={`@${user.username}`}
                />
              </List.Item>
            )}
          />
        </Col>
      </Row>
      <Modal
        open={selectedUser !== null}
        title={`Adicionar ${
          selectedUser ? selectedUser.name : ''
        } como administrador`}
        onCancel={() => setSelectedUser(null)}
        footer={[
          <Button key="cancel" onClick={() => setSelectedUser(null)}>
            Cancelar
          </Button>,
          <Button key="addAdmin" type="primary" onClick={addAdmin}>
            Adicionar Administrador
          </Button>,
        ]}
      ></Modal>
    </Card>
  );
};

export default ChannelAdmin;
