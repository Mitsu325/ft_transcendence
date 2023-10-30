import React from 'react';
import '../style.css'
import { Link } from 'react-router-dom'; // Importe Link do React Router
import { Breadcrumb, Layout, Menu, theme, Col, Divider, Row, Button, Typography, Space } from 'antd';

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

const HomePage: React.FC = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

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
                <Breadcrumb style={{ margin: '16px 0' }}>
                </Breadcrumb>
                <div style={{ padding: 24, background: colorBgContainer }}>
                    <div style={{ padding: 50, background: colorBgContainer }}>
                        <Divider></Divider>
                        <Space direction="vertical" align="center" style={{ display: 'flex', justifyContent: 'center' }}>
                            <Text><h1>Bem vindo ao Portal de Jogos do 42 JMP Team</h1></Text>
                        </Space>
                        <Row style={{ padding: 80 }}>
                            <Col span={24} style={{ display: 'flex', justifyContent: 'center' }}>
                                <Button type="primary" style={{ minWidth: 200 }} >
                                    <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>
                                        Login
                                    </Link>
                                </Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24} style={{ display: 'flex', justifyContent: 'center' }}>
                                <Link to="/signup" style={{ color: '#1677FF', textDecoration: 'none' }}>
                                    Ainda não sou cadastrado...
                                </Link>
                            </Col>
                        </Row>
                    </div>
                </div>
            </Content >
            <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by JMP Team</Footer>
        </Layout >
    );
};

export default HomePage;