import React, { useState } from 'react';
import { Modal, Button, Input } from 'antd';
import { channelApi } from 'services/channel.api';
import FailureNotification from 'components/Notification/FailureNotification';
import SuccessNotification from 'components/Notification/SuccessNotification';
import './style.css';

interface PasswordModalProps {
  channel: string;
  isModalOpen: boolean;
  openModal: boolean;
  onCancel: () => void;
}

const PasswordModal: React.FC<PasswordModalProps> = ({
  channel,
  isModalOpen,
  openModal,
  onCancel,
}) => {
  const [channelPassword, setChannelPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [removePassword, setRemovePassword] = useState('');

  const handleAddPassword = async () => {
    const res = await channelApi.addPassword(channel, channelPassword);

    if (res.data.message == 'Ok') {
      SuccessNotification({
        message: 'Ok',
        description: 'Senha adicionada com sucesso.',
      });
    } else {
      FailureNotification({
        message: 'Erro',
        description:
          'Não foi possível adicionar uma senha. Tente novamente mais tarde.',
      });
    }
    setChannelPassword('');
    onCancel();
  };

  const handleChangePassword = async () => {
    const res = await channelApi.changePassword(
      channel,
      oldPassword,
      newPassword,
    );

    if (res.data.message == 'Ok') {
      SuccessNotification({
        message: 'Ok',
        description: 'A senha foi atualizada com sucesso.',
      });
    } else {
      FailureNotification({
        message: 'Erro',
        description:
          'Não foi possível mudar a senha. Tente novamente mais tarde.',
      });
    }
    setNewPassword('');
    setOldPassword('');
    onCancel();
  };

  const handleRemovePassword = async () => {
    const res = await channelApi.removePassword(channel, removePassword);
    if (res.data.message == 'Ok') {
      SuccessNotification({
        message: 'Ok',
        description: 'A senha foi removida com sucesso.',
      });
    } else {
      FailureNotification({
        message: 'Erro',
        description:
          'Não foi possível remover senha. Tente novamente mais tarde.',
      });
    }
    setRemovePassword('');
    onCancel();
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <>
      <Modal
        title="Gerenciar Senha do Canal"
        open={isModalOpen}
        onCancel={handleCancel}
        closable={true}
        footer={null}
      >
        <Input
          className="input-pass"
          type="password"
          placeholder="Digite a senha"
          value={channelPassword}
          onChange={e => setChannelPassword(e.target.value)}
        />
        <Button type="primary" onClick={handleAddPassword}>
          Adicionar Senha
        </Button>
      </Modal>

      <Modal
        title="Gerenciar Senha do Canal"
        open={openModal}
        onCancel={handleCancel}
        closable={true}
        footer={null}
      >
        <p className="input-text">Mudar senha atual</p>
        <Input
          className="input-pass"
          type="password"
          placeholder="Senha atual"
          value={oldPassword}
          onChange={e => setOldPassword(e.target.value)}
        />
        <Input
          className="input-pass"
          type="password"
          placeholder="Nova senha"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
        />
        <Button type="primary" onClick={handleChangePassword}>
          Mudar Senha
        </Button>
        <p className="input-text">Remover senha atual</p>
        <Input
          className="input-pass"
          type="password"
          placeholder="Senha atual"
          value={removePassword}
          onChange={e => setRemovePassword(e.target.value)}
        />
        <Button type="primary" onClick={handleRemovePassword}>
          Remover Senha
        </Button>
      </Modal>
    </>
  );
};

export default PasswordModal;
