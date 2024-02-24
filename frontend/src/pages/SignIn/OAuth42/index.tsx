import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { createSearchParams, useSearchParams } from 'react-router-dom';
import SuccessNotification from 'components/Notification/SuccessNotification';
import FailureNotification from 'components/Notification/FailureNotification';
import { authService } from 'services/auth.api';
import { setAuthorizationHeader } from 'services/auth.service';
import { userService } from 'services/user.api';
import { useAuth } from 'hooks/useAuth';
import TwoFactorModal from 'components/Modal/TwoFactModal';
import UserModel from 'interfaces/userModel';

const CLIENT_ID =
  'u-s4t2ud-69c6515e1aadb326fe9b48fc0b673b271390fbb38afb06138005fbf548933f38';

export default function OAuth42() {
  const context = useAuth();
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [userId, setUserId] = useState('');
  const [visible, setVisible] = useState(false);
  const [verified, setVerified] = useState(false);
  const [loginData, setLoginData] = useState<{
    token: string | null;
    user: UserModel | null;
  }>();

  useEffect(() => {
    const codeParam = searchParams.get('code');
    if (!codeParam) return;

    const fetchData = async (code: string) => {
      try {
        setLoading(true);
        const res = await authService.loginWith42(code);
        searchParams.delete('code');
        setSearchParams(searchParams);
        setAuthorizationHeader(res.access_token);
        const user = await userService.getUser();
        setUserId(user.id);
        setLoginData({
          token: res.access_token,
          user,
        });
        if (user.twoFactorAuth) {
          setVisible(true);
        } else {
          setVerified(true);
        }
        setLoading(false);
      } catch (error) {
        FailureNotification({
          message: 'Não foi possível logar',
          description:
            'Por favor, verifique suas credenciais e tente novamente.',
        });

        setLoading(false);
      }
    };

    fetchData(codeParam);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    if (loginData?.token && loginData.user) {
      if (verified) {
        context.Login(loginData.token, loginData.user);
        SuccessNotification({
          message: 'Login bem-sucedido',
          description: 'Você foi autenticado com sucesso.',
        });
      } else {
        FailureNotification({
          message: 'Não foi possível logar',
          description:
            'Por favor, verifique suas credenciais e tente novamente.',
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verified]);

  function loginWith42() {
    const params = {
      client_id: CLIENT_ID,
      redirect_uri: 'http://localhost:3000',
      scope: 'public',
      response_type: 'code',
    };

    window.location.assign(
      'https://api.intra.42.fr/oauth/authorize?' +
        createSearchParams(params).toString(),
    );
  }

  return (
    <>
      <Button
        type="primary"
        style={{ minWidth: 200 }}
        onClick={loginWith42}
        loading={loading}
      >
        Login com Intra 42
      </Button>
      <TwoFactorModal
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        setVerified={setVerified}
        id={userId}
      />
    </>
  );
}
