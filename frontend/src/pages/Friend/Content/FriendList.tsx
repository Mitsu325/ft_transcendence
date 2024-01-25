import {
  Button,
  List,
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
import { LineOutlined, TrophyOutlined } from '@ant-design/icons';
import SuccessNotification from 'components/Notification/SuccessNotification';

export default function FriendList() {
  const [friend, setFriend] = useState<Invite[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const limit = 10;

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
          description:
            'Não foi possível carregar as informações. Verifique sua conexão e tente novamente',
        });
      });
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
    </>
  );
}
