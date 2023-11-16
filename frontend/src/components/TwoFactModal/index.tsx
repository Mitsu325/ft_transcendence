import React from 'react';
import { Modal, Input, Button } from 'antd';

interface TwoFactorModalProps {
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
  setOtp: (otp: string) => void;
}

const TwoFactorModal: React.FC<TwoFactorModalProps> = ({
  visible,
  onOk,
  onCancel,
  setOtp,
}) => {
  const handleOk = () => {
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
