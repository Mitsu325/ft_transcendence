import * as React from 'react';
import { Divider } from 'antd';
import 'pages/Home/style.css';
import { useAuth } from 'hooks/useAuth';
import { userService } from '../../services/user.api';

export default function Home() {
  const { user } = useAuth();

  React.useEffect(() => {
    const status_obj = {
      id: user?.id ?? '',
      status: 'online',
    };
    async function updateUserStatus() {
      await userService.updateUserStatus(status_obj);
    }
    updateUserStatus();
  }, [user]);

  return (
    <>
      <h1 className="text">JMP Pong!</h1>
      <Divider className="divider" />

      <div className="pong-container">
        <div className="middle-line"></div>
        <div className="paddle paddle-left"></div>
        <div className="paddle paddle-right"></div>
      </div>
    </>
  );
}
