import React from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const ChannelMessage: React.FC = () => {
  return (
    <div className="msgContainer">
      <ExclamationCircleOutlined className="exclamation" />
      <p>Você não é administrador ou dono deste canal.</p>
    </div>
  );
};

export default ChannelMessage;
