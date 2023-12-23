import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, theme } from 'antd';
import SignUpForm from 'pages/SignUp/SignUpForm';
import MyFooter from 'components/Footer';
import 'pages/SignUp/style.css';

const { Header, Content } = Layout;

const SignUpPage: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout className="page-container">
      <Header />
      <Content
        className="content-space"
        style={{ background: colorBgContainer }}
      >
        <h1 className="page-title mb-48">
          Bem vindo ao Portal de Jogos do 42 JMP Team
        </h1>
        <SignUpForm />
        <Link to="/login" className="link-pos-center mt-40 mb-24">
          Voltar para a página de login
        </Link>
      </Content>
      <MyFooter />
    </Layout>
  );
};

export default SignUpPage;
