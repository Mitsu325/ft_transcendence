import React, { useEffect, useState } from 'react';
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import {
  Breadcrumb,
  Layout,
  theme,
  Col,
  Divider,
  Row,
  Typography,
  Space,
  Button,
  notification,
} from 'antd';
import axios from 'axios';
import { AlertTwoTone, SmileTwoTone } from '@ant-design/icons';
const { Header, Content, Footer } = Layout;
const { Text } = Typography;

const CLIENT_ID =
  'u-s4t2ud-69c6515e1aadb326fe9b48fc0b673b271390fbb38afb06138005fbf548933f38';

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

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
    <Layout>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div className="demo-logo" />
      </Header>
      <Content className="site-layout" style={{ padding: '0 50px' }}>
        <Breadcrumb
          style={{ margin: '16px 0' }}
          items={[{ title: 'Home', href: '/' }]}
        />
        <div style={{ padding: 24, background: colorBgContainer }}>
          <div style={{ padding: 50, background: colorBgContainer }}>
            <Divider></Divider>
            <Space
              direction="vertical"
              align="center"
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <Text>
                <h1>Bem vindo ao Portal de Jogos do 42 JMP Team</h1>
              </Text>
            </Space>
            <Row>
              <Col span={8}>
                <Button
                  type="primary"
                  style={{ minWidth: 200 }}
                  onClick={loginWith42}
                  loading={loading}
                >
                  Login com Intra 42
                </Button>
              </Col>
              <Col
                span={8}
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                Form Login
              </Col>
              <Col span={8}></Col>
            </Row>
          </div>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Ant Design ©2023 Created by JMP Team
      </Footer>
    </Layout>
  );
};

export default LoginPage;
