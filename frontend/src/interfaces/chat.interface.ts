export type ChattingUser = {
  id: string;
  avatar: string;
  name: string;
  username?: string;
};

export type DividerMessage = {
  type: 'divider';
  text: string;
};

export type TextMessage = {
  id: string;
  type: 'text';
  text: string;
  senderUser: {
    id: string;
    avatar: string;
    name: string;
    username?: string;
  };
  hour: string;
};

export type Message = DividerMessage | TextMessage;

export type Chat = {
  chatUser: {
    id: string;
    avatar: string;
    name: string;
    username?: string;
  };
  text: string;
  date: string;
};
