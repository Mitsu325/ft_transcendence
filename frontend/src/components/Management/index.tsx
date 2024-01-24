import React, { useState, useEffect } from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import ChannelAdmin from './channelAdmin';
import { channelApi } from '../../services/channel.api';
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
    setIsAdmin(false);
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

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} theme="dark">
        <div className="sider">
          <span className="title">Canais</span>
          <div className="line"></div>
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
          {selectedChannel && (isAdmin || isOwner) ? (
            <ChannelAdmin channel={selectedChannel} />
          ) : (
            <>
              <div className="msgContainer">
                <ExclamationCircleOutlined className="exclamation" />
                <p>Você não é administrador ou dono deste canal.</p>
              </div>
            </>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default ChannelManagement;
