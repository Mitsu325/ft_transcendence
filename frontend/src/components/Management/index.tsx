import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import ChannelAdmin from './channelAdmin';
import { channelApi } from '../../services/channel.api';
import './style.css';
const { Content, Sider } = Layout;

interface ChannelProps {
  id: string;
  name_channel: string;
  type: string;
  owner: string;
}

const ChannelManagement: React.FC = () => {
  const [channels, setChannels] = useState<ChannelProps[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<ChannelProps>();
  const [hoveredChannel, setHoveredChannel] = useState<string | undefined>();

  const handleChannelClick = (channel: ChannelProps) => {
    setSelectedChannel(channel);
  };

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const channelsData = await channelApi.getChannel();
        console.log('Channels Data:', channelsData);
        setChannels(channelsData);
      } catch (error) {
        console.error('Erro ao obter canais:', error);
      }
    };
    fetchChannels();
  }, []);
  const handleChannelHover = (channel: ChannelProps) => {
    setHoveredChannel(channel.id);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} theme="dark">
        <div style={{ textAlign: 'center', padding: '10px' }}>
          <span style={{ color: 'white', fontSize: '1.2rem' }}>Canais</span>
          <div
            style={{ borderBottom: '1px solid white', marginTop: '5px' }}
          ></div>
        </div>
        <Menu
          mode="inline"
          theme="dark"
          selectedKeys={selectedChannel ? [selectedChannel.id] : []}
          onClick={({ key }) =>
            handleChannelClick(
              channels.find(channel => channel.id === key) ||
                ({} as ChannelProps),
            )
          }
          style={{ color: 'white' }}
        >
          {channels.map(channel => (
            <Menu.Item
              key={channel.id}
              onClick={() => handleChannelClick(channel)}
              onMouseEnter={() => handleChannelHover(channel)}
              style={{
                color: 'white',
                backgroundColor:
                  selectedChannel?.id === channel.id
                    ? '#1677FE'
                    : hoveredChannel === channel.id
                    ? '#1677FE'
                    : 'transparent',
              }}
              className="channel-menu-item"
            >
              {channel.name_channel}
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout>
        <Content style={{ marginLeft: '15px' }}>
          {selectedChannel && <ChannelAdmin channel={selectedChannel} />}
        </Content>
      </Layout>
    </Layout>
  );
};

export default ChannelManagement;
