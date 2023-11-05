import React from 'react';
import 'components/style.css';
import { Link } from 'react-router-dom';
import { Layout, theme, Divider, Row, Typography, Space } from 'antd';
import SignupForm from 'components/SignupForm';

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

const SignUpPage: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout>
      <Header className="header">
        <div className="demo-logo" />
      </Header>
      <Content className="site-layout">
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
              <Row>
                <div className="divform">
                  <SignupForm />
                  <Link to="/login" className="link">
                    Login
                  </Link>
                </div>
              </Row>
            </Space>
          </div>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Ant Design ©2023 Created by JMP Team
      </Footer>
    </Layout>
  );
};

export default SignUpPage;
