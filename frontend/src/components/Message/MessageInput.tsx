import React, { useState } from 'react';
import { Input, Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';

const { TextArea } = Input;

type MessageInputProps = {
  handleClick: (message: string) => void;
};

const MessageInput = ({ handleClick }: MessageInputProps) => {
  const [message, setMessage] = useState<string>('');

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setMessage(event.target.value);
  };

  const handleButtonClick = () => {
    handleClick(message);
    setMessage('');
  };

  return (
    <div style={{ position: 'relative' }}>
      <TextArea
        style={{ borderRadius: '0', paddingRight: '2.8rem' }}
        autoSize={{ minRows: 2, maxRows: 6 }}
        placeholder="Escreva uma mensagem"
        value={message}
        onChange={handleInputChange}
      />
      <Button
        className="send-button"
        type="primary"
        icon={<SendOutlined />}
        size={'middle'}
        onClick={handleButtonClick}
        disabled={!message}
      />
    </div>
  );
};

export default MessageInput;
