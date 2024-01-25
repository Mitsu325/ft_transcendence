import { Button, List, Pagination, PaginationProps, Tooltip } from 'antd';
import UserListItem from 'components/List/UserListItem';
import FailureNotification from 'components/Notification/FailureNotification';
import {
  FriendStatusType,
  Invite,
  InviteRes,
} from 'interfaces/friend.interface';
import React, { useEffect, useState } from 'react';
import { friendService } from 'services/friend.api';
import 'pages/Friend/Content/style.css';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import SuccessNotification from 'components/Notification/SuccessNotification';

export default function InviteReceivedList() {
  const [invites, setInvite] = useState<Invite[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const limit = 10;

  const loadInviteReceived = (page: number) => {
    setLoading(true);

    friendService
      .getInviteReceived({ limit, page })
      .then((res: InviteRes) => {
        setLoading(false);
        setInvite(res.data);
        setTotal(res.pagination.total);
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
    loadInviteReceived(1);
  }, []);

  const onChange: PaginationProps['onChange'] = (page: number) => {
    loadInviteReceived(page);
  };

  const confirm = (inviteId: string, status: FriendStatusType) => {
    setLoading(true);
    friendService
      .updateInviteStatus({ id: inviteId, status })
      .then(() => {
        setLoading(false);
        SuccessNotification({
          message: 'Ação concluída com sucesso!',
          description:
            status === 'active'
              ? 'Vocês agora são amigos'
              : 'Você ignorou o convite de amizade.',
        });
        loadInviteReceived(1);
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
        dataSource={invites}
        locale={{
          emptyText:
            'Parece que não há convites de amizade pendentes no momento. Continue explorando e fazendo novas conexões!',
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
            <Tooltip title="Aceitar">
              <Button
                shape="circle"
                icon={<CheckOutlined />}
                aria-label="Aceitar"
                style={{ marginRight: '12px', color: '#389e0d' }}
                onClick={() => confirm(item.id, 'active')}
              />
            </Tooltip>
            <Tooltip title="Ignorar">
              <Button
                shape="circle"
                icon={<CloseOutlined />}
                aria-label="Ignorar"
                style={{ color: '#cf1322' }}
                onClick={() => confirm(item.id, 'rejected')}
              />
            </Tooltip>
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
