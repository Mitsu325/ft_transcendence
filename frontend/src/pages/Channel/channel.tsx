import React, { useState, useEffect } from 'react';
import { Modal, Input } from 'antd';
import { WechatOutlined } from '@ant-design/icons';
import 'pages/Channel/style.css';
import { channelApi } from '../../services/channel.api';
import { joinRoom } from 'Socket/utilsSocket';
import { useAuth } from 'hooks/useAuth';
import FailureNotification from 'components/Notification/FailureNotification';

interface ChannelItemProps {
  id: string;
  name_channel: string;
  type: string;
  owner: string;
}

interface ChannelsProps {
  setComponent: React.Dispatch<React.SetStateAction<string>>;
  setCurrentRoom: React.Dispatch<React.SetStateAction<string>>;
  setNameChannel: React.Dispatch<React.SetStateAction<string>>;
  updateChannels: boolean;
}

export default function Channels({
  setComponent,
  setCurrentRoom,
  setNameChannel,
  updateChannels,
}: ChannelsProps) {
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [channels, setChannels] = useState<ChannelItemProps[]>([]);
  const [activeChannel, setActiveChannel] = useState<string | null>(null);
  const user = useAuth()?.user;

  useEffect(() => {
    const getChannels = async () => {
      const channelsData = await channelApi.getChannel();
      setChannels(channelsData);
    };

    getChannels();
  }, [updateChannels]);

  const handleOpenPasswordModal = () => {
    setPasswordModalVisible(true);
  };

  const handleClosePasswordModal = () => {
    setPasswordModalVisible(false);
    setPassword('');
  };

  const handleVerifyPassword = async () => {
    if (password) {
      const checkPass = await channelApi.verifyChannelPassword(
        activeChannel ?? '',
        password,
      );
      if (checkPass) {
        getToken(activeChannel ?? '');
        handleJoin(activeChannel ?? '', user?.name ?? '');
        setPasswordModalVisible(false);
      } else {
        setPassword('');
        FailureNotification({
          message: 'Senha incorreta',
          description: 'Tente novamente.',
        });
      }
    }
  };

  const handleJoin = async (roomId: string, userName: string) => {
    joinRoom(roomId, userName);
    setCurrentRoom(roomId);
    setComponent('conversation');
  };

  const getToken = async (roomId: string) => {
    try {
      const response = await channelApi.getToken(roomId);
      const { token } = response.data;
      sessionStorage.setItem('channel-token', token);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChatClick = async (roomId: string, name: string) => {
    const channel = channels.find(item => item.id === roomId);
    const token = sessionStorage.getItem('channel-token');
    setNameChannel(name);
    setActiveChannel(roomId);
    const userName = user?.name ?? '';

    if (!channel) {
      return;
    }

    switch (channel.type) {
      case 'Público':
        handleJoin(roomId, userName);
        break;
      case 'Protegido':
        if (!token) {
          handleOpenPasswordModal();
        } else {
          setCurrentRoom(roomId);
          setComponent('conversation');
        }
        break;
      case 'Privado':
        setComponent('create');
        FailureNotification({
          message: 'Canal Privado',
          description: 'Apenas usuários convidados podem participar',
        });
        break;
      default:
        console.warn(`Tipo de canal desconhecido: $(channel.type)`);
        break;
    }
  };

  return (
    <>
      <div className="channelList">
        {channels.map(item => (
          <div
            className={`channel-item ${
              activeChannel === item.id ? 'active' : ''
            }`}
            key={item.id}
            style={{
              borderLeft:
                activeChannel === item.id ? '5px solid #1677FF' : 'none',
            }}
          >
            <div
              className="icon-channel"
              onClick={() => handleChatClick(item.id, item.name_channel)}
            >
              <WechatOutlined className="chat-icon" />
            </div>
            <div className="channel-name">
              <p>{item.name_channel}</p>
              <small>{item.type}</small>
            </div>
          </div>
        ))}
      </div>

      <Modal
        title="Digite a senha do canal"
        open={passwordModalVisible}
        onOk={handleVerifyPassword}
        onCancel={handleClosePasswordModal}
      >
        <Input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </Modal>
    </>
  );
}
