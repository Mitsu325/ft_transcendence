import React, { useState, useEffect } from 'react';
import { useAuth } from 'hooks/useAuth';
import FailureNotification from 'components/Notification/FailureNotification';
import { channelApi } from 'services/channel.api';
import { adminService } from 'services/admin.api';
import { ChannelProps, typeAdmin } from 'interfaces/channel.interface';
import ChannelAdmin from './channelAdmin';
import ChannelMessage from './channelMessage';
import './style.css';

const ChannelManagement: React.FC = () => {
  const [channels, setChannels] = useState<ChannelProps[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<ChannelProps>();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [hasAdmin, setHasAdmin] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const user = useAuth()?.user;

  useEffect(() => {
    const getChannels = async () => {
      try {
        const channelsData = await channelApi.getChannel();
        setChannels(channelsData);
      } catch (error) {
        FailureNotification({
          message: 'Ops! Encontramos algumas falhas durante o processo',
          description:
            'Não foi possível carregar as informações. Verifique sua conexão e tente novamente',
        });
      }
    };
    getChannels();
  }, []);

  const handleChannelClick = async (channel: ChannelProps, index: number) => {
    setActiveIndex(index);
    setSelectedChannel(channel);
    const userId = user?.id ?? '';
    const ownerRes = await channelApi.getOwner(channel.id);
    const adminRes = await adminService.getAdminsId(channel.id);
    setHasAdmin(!!adminRes);
    setIsOwner(ownerRes.data === userId);
    const isAdminUser = adminRes.admins.some(
      (admins: typeAdmin) => admins.admin_id === userId,
    );
    setIsAdmin(!!isAdminUser);
  };

  return (
    <>
      <h1 className="title">Gerenciamento</h1>
      <div className="managemet-content">
        <div className="side-group">
          <h2 className="sub-title">Canais</h2>

          <div className="list-channel">
            <dl className="list-channel-group">
              {channels.map((channel, index) => (
                <dt
                  tabIndex={index + 1}
                  className={
                    'list-channel-item' +
                    (activeIndex === index ? ' list-channel-active' : '')
                  }
                  key={channel.id}
                  onClick={() => handleChannelClick(channel, index)}
                  onKeyDown={event => {
                    if (event.key === 'Enter') {
                      handleChannelClick(channel, index);
                    }
                  }}
                >
                  {channel.name_channel}
                </dt>
              ))}
            </dl>
          </div>
        </div>

        <div className="management-channel-group">
          {selectedChannel && (isAdmin || isOwner) ? (
            <ChannelAdmin
              channel={selectedChannel}
              owner={isOwner}
              hasAdmin={hasAdmin}
            />
          ) : (
            <ChannelMessage />
          )}
        </div>
      </div>
    </>
  );
};

export default ChannelManagement;
