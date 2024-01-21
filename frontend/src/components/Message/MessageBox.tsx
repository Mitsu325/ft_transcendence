import React from 'react';
import { List } from 'antd';
import 'components/Message/style.css';

type MessageBoxProps = {
  senderUser: {
    id: string;
    avatar: string;
    name: string;
    username?: string;
  };
  text: string;
  hour: string;
};

const MessageBox = ({ senderUser, text, hour }: MessageBoxProps) => {
  return (
    <List.Item style={{ borderBlock: 'none' }}>
      <List.Item.Meta
        title={
          <a
            href={'/profile/' + senderUser.username}
            style={{ color: '#001529', transition: 'color 0.5s' }}
            onMouseEnter={e =>
              ((e.target as HTMLElement).style.color = '#1677ff')
            }
            onMouseLeave={e =>
              ((e.target as HTMLElement).style.color = '#001529')
            }
          >
            {senderUser.name}
          </a>
        }
        description={
          <>
            <p className="message-text">{text}</p>
            <span className="hour-text">{hour}</span>
          </>
        }
      />
    </List.Item>
  );
};

export default MessageBox;
