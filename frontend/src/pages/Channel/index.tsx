import React, { useState, useEffect } from 'react';
import { Menu, Divider, Modal, Input } from 'antd';
import { MenuInfo } from 'rc-menu/lib/interface';
import { WechatOutlined } from '@ant-design/icons';
import 'pages/Channel/style.css';
import CreateChannel from '../../components/CreateChannel';
import Conversation from '../../components/Conversation';
import { channelApi } from '../../services/channel.api';
import { joinRoom } from 'Socket/utilsSocket';
import { useAuth } from 'hooks/useAuth';

interface ChannelItemProps {
  id: string;
  name_channel: string;
  type: string;
  owner: string;
}

const Channels: React.FC = () => {
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [nameChannel, setNameChannel] = useState('');
  const [current, setCurrent] = useState('channel');
  const [channels, setChannels] = useState<ChannelItemProps[]>([]);
  const [component, setComponent] = useState('create');
  const [currentRoom, setCurrentRoom] = useState<string>('');
  const [activeChannel, setActiveChannel] = useState<string | null>(null);
  const [updateChannels, setUpdateChannels] = useState(false);
  const user = useAuth()?.user;

  useEffect(() => {
    const getChannels = async () => {
      const channelsData = await channelApi.getChannel();
      setChannels(channelsData);
    };

    getChannels();
  }, [updateChannels]);

  const newChannels = () => {
    setUpdateChannels(prevState => !prevState);
  };

  const handleMenuClick = (e: MenuInfo) => {
    setCurrent(e.key as string);
    setComponent('create');
  };

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
        alert('Senha incorreta. Tente novamente.');
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
        alert('Canal privado, apenas usuários convidados podem participar.');
        break;
      default:
        console.warn(`Tipo de canal desconhecido: $(channel.type)`);
        break;
    }
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
                  className={`channel-item ${
                    activeChannel === item.id ? 'active' : ''
                  }`}
                  key={item.id}
                  onClick={() => handleChatClick(item.id, item.name_channel)}
                  style={{
                    borderLeft:
                      activeChannel === item.id ? '5px solid #1677FF' : 'none',
                  }}
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

          {current === 'chat' && (
            <div className="menu-chats">
              <p>Chat</p>
            </div>
          )}
        </div>

        <div className="messages">
          {component === 'create' && (
            <CreateChannel newChannels={newChannels} />
          )}
          {component === 'conversation' && (
            <>
              <Conversation roomId={currentRoom} nameChannel={nameChannel} />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Channels;
