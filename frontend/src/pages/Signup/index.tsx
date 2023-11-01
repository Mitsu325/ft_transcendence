import React from 'react';
import '../style.css'
import { Link } from 'react-router-dom';
import { Breadcrumb, Layout, Menu, theme, Col, Divider, Row, Button, Typography, Space } from 'antd';

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
            <Content className="site-layout" style={{ padding: '0 50px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>
                        <Link to="/" style={{ color: 'black', textDecoration: 'none' }}>
                            <h3>Home</h3>
                        </Link>
                    </Breadcrumb.Item>
                </Breadcrumb>
                <div style={{ padding: 24, background: colorBgContainer }}>
                    <div style={{ padding: 50, background: colorBgContainer }}>
                        <Divider></Divider>
                        <Space direction="vertical" align="center" style={{ display: 'flex', justifyContent: 'center' }}>
                            <Text><h1>Bem vindo ao Portal de Jogos do 42 JMP Team</h1></Text>
                        </Space>
                        <Row>
                            <Col span={8}></Col>
                            <Col span={8} style={{ display: 'flex', justifyContent: 'center' }}>Form SignUp</Col>
                            <Col span={8}></Col>
                        </Row>
                    </div>
                </div>
            </Content >
            <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by JMP Team</Footer>
        </Layout>
    );
};

export default SignUpPage;