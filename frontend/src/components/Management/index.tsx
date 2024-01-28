import React, { useState, useEffect } from 'react';

import { Layout } from 'antd';
import ChannelAdmin from './channelAdmin';
import { channelApi } from '../../services/channel.api';
import ChannelMessage from './channelMessage';
import { adminService } from 'services/admin.api';
import './style.css';
const { Content, Sider } = Layout;
import { useAuth } from '../../hooks/useAuth';

interface ChannelProps {
  id: string;
  name_channel: string;
  type: string;
  owner: string;
}

interface typeAdmin {
  admin_id: string;
}

const ChannelManagement: React.FC = () => {
  const [channels, setChannels] = useState<ChannelProps[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<ChannelProps>();
  const [hoveredChannel, setHoveredChannel] = useState<string | undefined>();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  const user = useAuth()?.user;

  const handleChannelClick = async (channel: ChannelProps) => {
    setIsOwner(false);
    setIsAdmin(false);
    setSelectedChannel(channel);
    const userId = user?.id ?? '';
    const ownerRes = await channelApi.getOwner(channel.id);
    const adminRes = await adminService.getAdminsId(channel.id);
    if (ownerRes.data === userId) {
      setIsOwner(true);
    }
    const isAdminUser = adminRes.admins.some(
      (admins: typeAdmin) => admins.admin_id === userId,
    );
    if (isAdminUser) {
      setIsAdmin(true);
    }
  };

  useEffect(() => {
    const getChannels = async () => {
      try {
        const channelsData = await channelApi.getChannel();
        setChannels(channelsData);
      } catch (error) {
        console.error('Erro ao obter canais:', error);
      }
    };
    getChannels();
  }, []);

  const handleChannelHover = (channel: ChannelProps) => {
    setHoveredChannel(channel.id);
  };

  const handleMouseLeave = () => {
    setHoveredChannel(undefined);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} theme="dark">
        <div className="sider">
          <span className="sider-title">Canais</span>
          <div className="line"></div>
        </div>
        <ul className="list">
          {channels.map(channel => (
            <li
              className="items"
              key={channel.id}
              onClick={() => handleChannelClick(channel)}
              onMouseEnter={() => handleChannelHover(channel)}
              onMouseLeave={handleMouseLeave}
              style={{
                backgroundColor:
                  selectedChannel?.id === channel.id
                    ? '#1677FE'
                    : hoveredChannel === channel.id
                    ? '#1677FE'
                    : 'transparent',
              }}
            >
              {channel.name_channel}
            </li>
          ))}
        </ul>
      </Sider>
      <Layout>
        <Content style={{ marginLeft: '15px' }}>
          {selectedChannel && (isAdmin || isOwner) ? (
            <ChannelAdmin channel={selectedChannel} owner={isOwner} />
          ) : (
            <ChannelMessage />
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default ChannelManagement;
