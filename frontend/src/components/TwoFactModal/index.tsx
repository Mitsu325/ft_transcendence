import React, { useState, useEffect } from 'react';
import { Modal, Input, Button } from 'antd';
import axios from 'axios';

interface TwoFactorModalProps {
  visible: boolean;
  onVerify: (verified: boolean) => void;
  onCancel: () => void;
  id: string;
  setVerified: (verified: boolean) => void;
}

const TwoFactorModal: React.FC<TwoFactorModalProps> = ({
  visible,
  onVerify,
  onCancel,
  id,
  setVerified,
}) => {
  const [otp, setOtp] = useState('');
  const [userId, setUserID] = useState('');

  useEffect(() => {
    setUserID(id);
  }, [id]);

  const handleVerify = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3003/auth/two-factor-auth',
        { userId, otp },
      );

      if (response.data.verified) {
        setVerified(true);
        onVerify(true);
      }
    } catch (err) {
      console.error(err);
    }
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
        <Button key="verify" type="primary" onClick={handleVerify}>
          Verificar
        </Button>,
      ]}
    >
      <div style={{ marginBottom: '10px' }}>
        <Input
          value={otp}
          onChange={e => setOtp(e.target.value)}
          placeholder="Insira o código OTP"
        />
      </div>
    </Modal>
  );
};

export default TwoFactorModal;
