import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
// import {
//   UserOutlined,
//   TeamOutlined,
//   PlusOutlined,
//   DeleteOutlined,
// } from '@ant-design/icons';
import ChannelAdmin from './details';
import { channelApi } from '../../services/channel.api';

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

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} theme="dark">
        <div className="hd" style={{ textAlign: 'center', padding: '10px' }}>
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
          items={channels.map(channel => ({
            key: channel.id,
            label: channel.name_channel,
          }))}
          style={{ color: 'white' }}
        />
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
