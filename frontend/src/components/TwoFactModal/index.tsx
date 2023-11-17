import React, { useState } from 'react';
import { Modal, Input, Button } from 'antd';
import FailureNotification from 'components/Notification/FailureNotification';
import handleVerify from 'services/verifyTF.api';

interface TwoFactorModalProps {
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
  setVerified: (verified: boolean) => void;
  id: string;
}

const TwoFactorModal: React.FC<TwoFactorModalProps> = ({
  visible,
  onOk,
  onCancel,
  setVerified,
  id,
}) => {
  const [otp, setOtp] = useState('');

  const handleOk = () => {
    handleVerify(id, otp)
      .then(result => {
        if (typeof result === 'boolean') {
          setVerified(result);
          if (!result) {
            FailureNotification({
              message: 'Não foi possível logar',
              description:
                'Por favor, verifique suas credenciais e tente novamente.',
            });
          }
        } else {
          console.error('Resultado inesperado de handleVerify:', result);
        }
      })
      .catch(error => {
        console.error('Erro ao verificar:', error);
      });
    onOk();
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Modal
      title="Insira o Código OTP"
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancelar
        </Button>,
        <Button key="verify" type="primary" onClick={handleOk}>
          OK
        </Button>,
      ]}
    >
      <div style={{ marginBottom: '10px' }}>
        <Input
          onChange={e => setOtp(e.target.value)}
          placeholder="Insira o código OTP"
        />
      </div>
    </Modal>
  );
};

export default TwoFactorModal;
