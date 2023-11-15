import React, { useState, useEffect } from 'react';
import { Modal, Input, Button } from 'antd';
import axios from 'axios';

interface TwoFactorModalProps {
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
  TFSecret: string;
}

const TwoFactorModal: React.FC<TwoFactorModalProps> = ({
  visible,
  onOk,
  onCancel,
  TFSecret,
}) => {
  const [otp, setOtp] = useState('');
  const [userSecret, setuserSecret] = useState('');

  useEffect(() => {
    setuserSecret(TFSecret);
  }, [TFSecret]);

  const handleVerify = async () => {
    try {
      console.log(userSecret, otp);
      const response = await axios.post(
        'http://localhost:3003/two-factor-auth/verifyOTP',
        { userSecret, otp },
      );

      // console.log(response.data);

      // if (response.data.verified) {
      //   alert('Login success');
      // } else {
      //   alert('Login failed');
      // }
    } catch (err) {
      console.error(err);
    }
    onOk();
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Modal
      title="Insira o Código OTP"
      open={visible}
      onOk={handleVerify}
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
