import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, theme } from 'antd';
import SignInForm from 'pages/SignIn/SignInForm';
import MyFooter from 'components/Footer';
import 'pages/SignIn/style.css';

const { Header, Content } = Layout;

const SignInPage: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout className="page-container">
      <Header />
      <Content className="content" style={{ background: colorBgContainer }}>
        <h1 className="page-title mb-48">
          Bem vindo ao Portal de Jogos do 42 JMP Team
        </h1>
        <SignInForm />
        <Link to="/signup" className="link-pos-center mt-40 mb-24">
          Ainda não sou cadastrado...
        </Link>
      </Content>
      <MyFooter />
    </Layout>
  );
};

export default SignInPage;
