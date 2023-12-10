import React from 'react';

// TODO: criar o componente ChatMessageList para listar as mensagens
// TODO: criar o componente messageBox que será chamdo na ChatMessageList

interface MessageCardProps {
  selectedMenu: string;
  selectedUser?: string;
}

export default function MessageCard({
  selectedMenu,
  selectedUser,
}: MessageCardProps) {
  const renderComponent = () => {
    if (selectedMenu === 'channel') {
      return <h1>Channel</h1>;
    } else {
      if (!selectedUser) {
        return <h1>Welcome Page</h1>;
      }
      return <h1>Message: {selectedUser}</h1>;
    }
  };

  return <div className="card message-card">{renderComponent()}</div>;
}
