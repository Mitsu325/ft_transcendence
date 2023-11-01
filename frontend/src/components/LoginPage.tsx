import React, { useEffect } from 'react';
import { createSearchParams, useSearchParams } from 'react-router-dom'; // Importe Link do React Router
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
} from 'antd';
import axios from 'axios';
const { Header, Content, Footer } = Layout;
const { Text } = Typography;

const CLIENT_ID =
  'u-s4t2ud-69c6515e1aadb326fe9b48fc0b673b271390fbb38afb06138005fbf548933f38';

const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    const codeParam = searchParams.get('code');
    if (codeParam) {
      const params = {
        code: codeParam,
      };
      axios
        .post(
          'http://localhost:3003/auth/42?' +
            createSearchParams(params).toString(),
        )
        .then(response => {
          console.log('response');
          console.log(response);
          // TODO: direcionar para a página do jogo
        })
        .catch(error => {
          console.log('error');
          console.error(error);
          // TODO: mostrar uma mensagem de erro
        });
    }
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
