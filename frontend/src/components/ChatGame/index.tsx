import React, { useState } from 'react';
import { Input, Button } from 'antd';
import './style.css';

interface ChatGameProps {
  sendMessage: (message: string) => void;
  message: string;
}

const ChatGame: React.FC<ChatGameProps> = ({ sendMessage, message }) => {
  const [messageToSend, setMessageToSend] = useState('');

  return (
    <div>
      <div>{message}</div>
      <Input
        value={messageToSend}
        onChange={e => setMessageToSend(e.target.value)}
      />
      <Button onClick={() => sendMessage(messageToSend)}>Enviar</Button>
    </div>
  );
};

export default ChatGame;
