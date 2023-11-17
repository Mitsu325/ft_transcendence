import React, { useState } from 'react';
import { Menu, Divider } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { WechatOutlined } from '@ant-design/icons';
import { MenuInfo } from 'rc-menu/lib/interface';
import 'pages/Channel/style.css';
import { useAuth } from 'hooks/useAuth';

// interface ChannelItemProps {
//   name: string;
//   type: 'public' | 'private' | 'protected';
//   owner: string;
// }

// const ChannelItem: React.FC<ChannelItemProps> = ({ name, type }) => {
//   return (
//     <div className="channel-item">
//       <div className="icon-channel">
//         <WechatOutlined className="chat-icon" />
//       </div>
//       <div className="channel-name">
//         <p>{name}</p>
//         <small>{type}</small>
//       </div>
//     </div>
//   );
// };

const Channels: React.FC = () => {
  // const [channels, setChannels] = useState<ChannelItemProps[]>([]);
  const [current, setCurrent] = useState('channel');

  const handleMenuClick = (e: MenuInfo) => {
    setCurrent(e.key as string);
  };
  const { user } = useAuth();

  const handleIconClick = () => {
    const userId = user?.id ?? ' ';
    // const newChannel: ChannelItemProps = {
    //   name: 'Novo Canal',
    //   type: 'public',
    //   owner: { userId },
    // };
    // setChannels([...channels, newChannel]);
  };

  const menuItems = [
    {
      label: 'Canais',
      key: 'channel',
    },
    {
      label: 'Chats',
      key: 'chat',
    },
  ];

  return (
    <>
      <div className="channel-grid">
        <div className="channel">
          <Menu
            className="menu"
            onClick={handleMenuClick}
            selectedKeys={[current]}
            mode="horizontal"
            items={menuItems}
          />
          <Divider className="divider" />

          {current === 'channel' && (
            <div>
              {/* {channels.map(channel => (
                <ChannelItem key={channel.name} {...channel} />
              ))} */}
            </div>
          )}

          {current === 'chat' && (
            <div className="menu-chats">
              <p>Chat</p>
            </div>
          )}
        </div>

        <div className="chat">
          <div className="icon-container" onClick={handleIconClick}>
            <p className="text-icon">Criar canal</p>
            <PlusCircleOutlined className="plus-icon" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Channels;
