import React, { useEffect, useState } from 'react';
import { Button, notification } from 'antd';
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import axios from 'axios';
import { AlertTwoTone, SmileTwoTone } from '@ant-design/icons';

const CLIENT_ID =
  'u-s4t2ud-69c6515e1aadb326fe9b48fc0b673b271390fbb38afb06138005fbf548933f38';

export default function OAuth42() {
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const codeParam = searchParams.get('code');
    if (codeParam) {
      setLoading(true);
      const params = {
        code: codeParam,
      };
      axios
        .post(
          'http://localhost:3003/auth/42?' +
            createSearchParams(params).toString(),
        )
        .then(response => {
          // TODO: salvar response
          console.log(response);

          notification.open({
            message: 'Login bem-sucedido',
            description: 'Você foi autenticado com sucesso.',
            icon: <SmileTwoTone twoToneColor="#096dd9" />,
          });
          navigate('/');
        })
        .catch(() => {
          notification.open({
            message: 'Não foi possível logar com a Intra 42',
            description:
              'Por favor, verifique suas credenciais e tente novamente.',
            icon: <AlertTwoTone twoToneColor="#cf1322" />,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  function loginWith42() {
    const params = {
      client_id: CLIENT_ID,
      redirect_uri: 'http://localhost:3000/login',
      response_type: 'code',
    };

    window.location.assign(
      'https://api.intra.42.fr/oauth/authorize?' +
        createSearchParams(params).toString(),
    );
  }

  return (
    <Button
      type="primary"
      style={{ minWidth: 200 }}
      onClick={loginWith42}
      loading={loading}
    >
      Login com Intra 42
    </Button>
  );
}
