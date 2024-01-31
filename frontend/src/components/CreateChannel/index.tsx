import React, { useState, useEffect } from 'react';
import { useAuth } from 'hooks/useAuth';
import { channelApi } from '../../services/channel.api';
import { userService } from '../../services/user.api';
import { Modal, Input, Button, Select } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import './style.css';

const { Option } = Select;

interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
}

const CreateChannel: React.FC<{ newChannels: () => void }> = ({
  newChannels,
}) => {
  const [typeModalVisible, setTypeModalVisible] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [channelName, setChannelName] = useState('');
  const [channelType, setChannelType] = useState('');
  const [channelPassword, setChannelPassword] = useState('');

  useEffect(() => {
    const getUsers = async () => {
      const data = await userService.getAllUsers();
      setUsers(data);
    };

    getUsers();
  }, []);

  const showTypeSelectionModal = () => {
    setTypeModalVisible(true);
  };

  const showChannelNameModal = (selectedType: string) => {
    setChannelType(selectedType);
    setTypeModalVisible(false);
    setIsModalOpen(true);
  };

  const { user } = useAuth();
  const sendForm = async () => {
    if (user && user.id) {
      await channelApi.createChannel({
        name_channel: channelName,
        type: channelType,
        owner: user.id,
        password: channelPassword,
        users: selectedUsers,
      });
      newChannels();
      setChannelName('');
      setChannelType('');
      setChannelPassword('');
      setSelectedUsers([]);
    }

    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setTypeModalVisible(false);
  };

  return (
    <>
      <div className="icon-container" onClick={showTypeSelectionModal}>
        <p className="text-icon">Criar canal</p>
        <PlusCircleOutlined className="plus-icon" />
      </div>
      <Modal
        title="Selecione o Tipo de Canal"
        open={typeModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="publico" onClick={() => showChannelNameModal('Público')}>
            Público
          </Button>,
          <Button key="privado" onClick={() => showChannelNameModal('Privado')}>
            Privado
          </Button>,
          <Button
            key="protegido"
            onClick={() => showChannelNameModal('Protegido')}
          >
            Protegido
          </Button>,
        ]}
      />

      <Modal
        title={`Insira o Nome do Canal ${channelType}`}
        open={isModalOpen}
        onOk={sendForm}
        onCancel={handleCancel}
        okText="Enviar"
        cancelText="Cancelar"
      >
        <Input
          className="input"
          placeholder="Nome do canal"
          value={channelName}
          onChange={e => setChannelName(e.target.value)}
        />
        {channelType === 'Protegido' && (
          <Input
            type="password"
            className="input"
            placeholder="Senha do canal"
            value={channelPassword}
            onChange={e => setChannelPassword(e.target.value)}
          />
        )}
        {channelType === 'Privado' && (
          <>
            <Select
              mode="multiple"
              placeholder="Selecione usuários para adicionar ao canal"
              value={selectedUsers}
              onChange={values => setSelectedUsers(values)}
              style={{ width: '100%', marginTop: '10px' }}
            >
              {users.map(user => (
                <Option key={user.id} value={user.id}>
                  {user.name}
                </Option>
              ))}
            </Select>{' '}
          </>
        )}
      </Modal>
    </>
  );
};

export default CreateChannel;
