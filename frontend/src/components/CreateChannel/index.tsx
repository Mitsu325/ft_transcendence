import React, { useState } from 'react';
import { useAuth } from 'hooks/useAuth';
import { channelApi } from '../../services/channel.api';
import { Modal, Input, Button } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import './style.css';

const CreateChannel: React.FC = () => {
  const [typeModalVisible, setTypeModalVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [channelName, setChannelName] = useState('');
  const [channelType, setChannelType] = useState('');
  const [channelPassword, setChannelPassword] = useState('');

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
      const result = await channelApi.createChannel({
        name_channel: channelName,
        type: channelType,
        owner: user.id,
        password: channelPassword,
      });
      console.log(result);
      setChannelName('');
      setChannelType('');
      setChannelPassword('');
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
      </Modal>
    </>
  );
};

export default CreateChannel;
