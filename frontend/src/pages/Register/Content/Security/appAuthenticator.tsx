import React, { useState } from 'react';
import { Divider, QRCode, Switch } from 'antd';
import { MobileOutlined } from '@ant-design/icons';
import SuccessNotification from 'components/Notification/SuccessNotification';
import FailureNotification from 'components/Notification/FailureNotification';
import { useAuth } from 'hooks/useAuth';
import { userService } from 'services/user.api';

export default function AppAuthenticator() {
  const { user, UpdateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState('');
  const [secret, setSecret] = useState('');

  const formatSecret = (secret: string) => {
    if (!secret) return '';
    const matches = secret.match(/.{1,4}/g);
    return matches ? matches.join(' ') : '';
  };

  const onChange = (checked: boolean) => {
    setLoading(true);
    userService
      .update2fa(checked)
      .then(res => {
        setLoading(false);
        UpdateUser(res.user);
        setUrl(res?.url);
        setSecret(res?.secret);
        SuccessNotification({
          message: '2FA Atualizado',
          description: checked
            ? 'Parabéns! A Autenticação de Dois Fatores (2FA) foi ativada com sucesso. Sua conta está mais protegida!'
            : '2FA Desativado. Lembre-se de ativar para uma camada extra de segurança. Sua segurança é nossa prioridade!',
        });
      })
      .catch(() => {
        setLoading(false);
        FailureNotification({
          message: `Erro ao ${checked ? 'Ativar' : 'Desativar'} 2FA`,
          description: 'Tente novamente',
        });
      });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    SuccessNotification({
      message: 'Copiado com Sucesso!',
      description:
        'O código secreto foi copiado para a área de transferência. Agora você pode colá-lo onde precisar.',
    });
  };

  return (
    <>
      <h2 className="profile-sub-title">Autenticação de dois fatores</h2>
      <Divider />
      <p className="profile-text mb-24">
        A Autenticação de Dois Fatores (2FA) adiciona uma camada extra de
        segurança à sua conta, exigindo mais do que apenas uma senha para fazer
        login.
      </p>
      <div className="security-group">
        <MobileOutlined
          style={{ fontSize: '24px', color: '#001529', marginRight: '12px' }}
        />
        <div>
          <h3 className="security-title">App autenticador</h3>
          <p className="security-text mb-12">
            Use um aplicativo de autenticação ou extensão de navegador para
            obter códigos de autenticação de dois fatores quando solicitado.
          </p>
          <Switch
            className="security-text"
            checkedChildren="Ativado"
            unCheckedChildren="Desativado"
            value={!!user?.twoFactorAuth}
            loading={loading}
            onChange={onChange}
          />

          {url && secret && (
            <>
              <p className="profile-text mt-20">
                Use um aplicativo de autenticação (como Duo ou Google
                Authenticator) para fazer a leitura deste código QR.
              </p>
              <QRCode
                value={url}
                className="qr-code"
                color="#001529"
                bgColor="#fff"
              />
              <p className="profile-text">
                Ou insira este código no seu aplicativo de autenticação
              </p>
              <span className="secret-text" onClick={() => handleCopy(secret)}>
                {formatSecret(secret)}
              </span>
            </>
          )}
        </div>
      </div>
    </>
  );
}
