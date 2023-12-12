import React, { useState, useEffect } from 'react';
import { Menu, Divider } from 'antd';
import { MenuInfo } from 'rc-menu/lib/interface';
import { WechatOutlined } from '@ant-design/icons';
import 'pages/Channel/style.css';
import CreateChannel from '../../components/CreateChannel';
import Conversation from '../../components/Conversation';
import { channelService } from '../../services/channel.api';
import { joinRoom } from 'Socket/utilsSocket';
import { useAuth } from 'hooks/useAuth';
interface ChannelItemProps {
  id: string;
  name_channel: string;
  type: string;
  owner: string;
}

const Channels: React.FC = () => {
  const [current, setCurrent] = useState('channel');
  const [channels, setChannels] = useState<ChannelItemProps[]>([]);
  const [component, setComponent] = useState('modal');
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const user = useAuth()?.user;

  useEffect(() => {
    const getChannels = async () => {
      const channelsData = await channelService.getChannel();
      setChannels(channelsData);
    };

    getChannels();
  }, []);

  const handleMenuClick = (e: MenuInfo) => {
    setCurrent(e.key as string);
    setComponent('create');
  };

  const handleChatClick = (roomId: string) => {
    const userName = user?.name ?? '';
    joinRoom(roomId, userName);

    console.log(roomId);
    setCurrentRoom(roomId);
    setComponent('conversation');
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
              {channels.map(item => (
                <div
                  className="channel-item"
                  key={item.id}
                  onClick={() => handleChatClick(item.id)}
                >
                  <div className="icon-channel">
                    <WechatOutlined className="chat-icon" />
                  </div>
                  <div className="channel-name">
                    <p>{item.name_channel}</p>
                    <small>{item.type}</small>
                  </div>
                </div>
              ))}
            </div>
          )}

          {current === 'chat' && (
            <div className="menu-chats">
              <p>Chat</p>
            </div>
          )}
        </div>

        <div className="chat">
          {component === 'create' && <CreateChannel />}
          {component === 'conversation' && (
            <>
              <Conversation roomId={currentRoom} />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Channels;
