import React from 'react';
import { Input, Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const MessageInput = () => {
  return (
    <div style={{ position: 'relative' }}>
      <TextArea
        style={{ borderRadius: '0', paddingRight: '2.8rem' }}
        className="scroll"
        autoSize={{ minRows: 2, maxRows: 6 }}
        placeholder="Escreva uma mensagem"
      />
      <Button
        className="send-button"
        type="primary"
        icon={<SendOutlined />}
        size={'middle'}
      />
    </div>
  );
};

export default MessageInput;
