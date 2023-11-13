import React, { useState } from 'react';
import { PoweroffOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useAuth } from 'hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import SuccessNotification from 'components/Notification/SuccessNotification';

export default function Register() {
  const [loading, setLoading] = useState(false);
  const context = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    setLoading(true);
    context.Logout();
    SuccessNotification({
      message: 'Sessão encerrada',
      description: 'A sua sessão foi encerrada.',
    });
    navigate('/');
  };

  return (
    <div>
      <h1>Conteudo cadastro de usuário</h1>
      <Button
        type="primary"
        icon={<PoweroffOutlined />}
        loading={loading}
        onClick={() => onLogout()}
        style={{ marginTop: 20 }}
      >
        Logout
      </Button>
    </div>
  );
}
