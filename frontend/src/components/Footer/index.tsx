import * as React from 'react';
import { Layout } from 'antd';
import 'components/Footer/style.css';

const { Footer } = Layout;

export default function MyFooter() {
  return (
    <Footer className="footer" style={{ textAlign: 'center' }}>
      Ant Design ©2023 Created by JMP Team
    </Footer>
  );
}
