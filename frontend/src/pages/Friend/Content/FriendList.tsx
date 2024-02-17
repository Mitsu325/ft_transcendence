import {
  Button,
  List,
  Modal,
  Pagination,
  PaginationProps,
  Popconfirm,
  Tooltip,
} from 'antd';
import UserListItem from 'components/List/UserListItem';
import FailureNotification from 'components/Notification/FailureNotification';
import { Invite, InviteRes } from 'interfaces/friend.interface';
import React, { useEffect, useState } from 'react';
import { friendService } from 'services/friend.api';
import 'pages/Friend/Content/style.css';
import { AlertOutlined, LineOutlined, TrophyOutlined } from '@ant-design/icons';
import SuccessNotification from 'components/Notification/SuccessNotification';
import { friendSocket } from 'socket';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { userNonSensitiveInfo } from 'interfaces/userModel';
import { useAuth } from 'hooks/useAuth';
import { userService } from 'services/user.api';

interface UserStatus {
  id: string;
  status: 'online' | 'playing' | 'offline';
}

export default function FriendList() {
  const { user } = useAuth();
  const [friend, setFriend] = useState<Invite[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<UserStatus[]>([]);
  const [modal, contextHolder] = Modal.useModal();
  const limit = 10;
  const navigate = useNavigate();

  const loadFriends = (page: number) => {
    setLoading(true);

    friendService
      .getFriends({ limit, page })
      .then((res: InviteRes) => {
        setFriend(res.data);
        setTotal(res.pagination.total);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        FailureNotification({
          message: 'Ops! Encontramos algumas falhas durante o processo',
          description:
            'Não foi possível carregar as informações. Verifique sua conexão e tente novamente',
        });
      });
  };

  useEffect(() => {
    loadFriends(1);
  }, []);

  useEffect(() => {
    getStatus();
    const intervalId = setInterval(() => {
      getStatus();
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);

  const getStatus = () => {
    userService.getUsersStatus().then(usersStatus => {
      setStatus(usersStatus);
    });
  };

  const onChange: PaginationProps['onChange'] = (page: number) => {
    loadFriends(page);
  };

  const confirm = (inviteId: string) => {
    setLoading(true);
    friendService
      .updateInviteStatus({ id: inviteId, status: 'unfriended' })
      .then(() => {
        setLoading(false);
        SuccessNotification({
          message: 'Ação concluída com sucesso!',
          description:
            'A amizade foi desfeita com sucesso. Agora você poderá explorar novas conexões e experiências.',
        });
        loadFriends(1);
      })
      .catch(() => {
        setLoading(false);
        FailureNotification({
          message: 'Ops! Encontramos algumas falhas durante o processo',
          description: 'Verifique sua conexão e tente novamente',
        });
      });
  };

  const inviteToPlay = async (friend: userNonSensitiveInfo) => {
    try {
      const status = await userService.getUserStatusById(friend.id);

      if (status !== 'online') {
        modal.warning({
          title: 'Não é possível convidar para jogar',
          icon: <AlertOutlined />,
          content: `Infelizmente, ${friend.name} não está disponível para jogar`,
          okText: 'Fechar',
          onOk: () => Modal.destroyAll(),
        });
        return;
      }
    } catch (error) {
      return;
    }

    friendSocket.emit('invite-play', {
      sender: {
        id: user?.id,
        name: user?.name,
        username: user?.username,
        avatar: user?.avatar,
      },
      recipient: friend,
    });

    const path = {
      pathname: '/game-options',
      search: createSearchParams({ guestId: friend.id }).toString(),
    };
    navigate(path);
  };

  return (
    <>
      <List
        dataSource={friend}
        locale={{
          emptyText:
            'Sua lista de amizades está vazia no momento. Que tal convidar alguns amigos para se conectar? Compartilhe momentos, convide para jogar e aproveite a diversão juntos!',
        }}
        renderItem={item => (
          <UserListItem
            userStatus={
              status.find(statusData => statusData.id === item.friend.id)
                ?.status || 'offline'
            }
            active={false}
            avatar={item.friend.avatar}
            title={item.friend.name}
            description={item.friend.username}
            username={item.friend.username}
            itemClassName="gray"
          >
            <Tooltip title="Convidar para jogar">
              <Button
                shape="circle"
                icon={<TrophyOutlined />}
                aria-label="Convidar para jogar"
                style={{ marginRight: '8px' }}
                onClick={() => inviteToPlay(item.friend)}
              />
            </Tooltip>
            <Popconfirm
              title="Deixar de ser amigo"
              description="Você tem certeza que deseja continuar?"
              onConfirm={() => confirm(item.id)}
              okText="Sim"
              cancelText="Não"
            >
              <Button
                shape="circle"
                icon={<LineOutlined />}
                aria-label="Deixar de ser amigo"
                style={{ color: '#cf1322' }}
              />
            </Popconfirm>
          </UserListItem>
        )}
      />
      <Pagination
        className="friend-pagination"
        defaultCurrent={1}
        pageSize={limit}
        total={total}
        onChange={onChange}
        disabled={loading}
        hideOnSinglePage
      />
      {contextHolder}
    </>
  );
}
