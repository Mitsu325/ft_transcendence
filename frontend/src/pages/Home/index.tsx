import React from 'react';
import '../style.css'
import { Link } from 'react-router-dom';
import { Breadcrumb, Layout, Menu, theme, Col, Divider, Row, Button, Typography, Space } from 'antd';
import ButtonLink from '../../components/Buttons';

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

const HomePage: React.FC = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <Layout>
            <Header className="header">
                <div className="demo-logo" />
            </Header>
            <Content className="site-layout">
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item>
                        <Link to="/" style={{ color: 'black', textDecoration: 'none' }}>
                            Portal JMP
                        </Link>
                    </Breadcrumb.Item>
                </Breadcrumb>
                <div style={{ padding: 24, background: colorBgContainer }}>
                    <div style={{ padding: 50, background: colorBgContainer }}>
                        <Divider></Divider>
                        <Space direction="vertical" align="center" style={{ display: 'flex', justifyContent: 'center' }}>
                            <Text><h1>Bem vindo ao Portal de Jogos do 42 JMP Team</h1></Text>
                            <Row>
                                <ButtonLink to="/login" text="Login" />
                            </Row>
                            <Row>
                                <Link to="/signup" className='link'>
                                    Ainda não sou cadastrado...
                                </Link>
                            </Row>
                        </Space>
                    </div>
                </div>
            </Content >
            <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by JMP Team</Footer>
        </Layout >
    );
};

export default HomePage;