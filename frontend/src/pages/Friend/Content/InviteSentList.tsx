import { Button, List, Pagination, PaginationProps, Tooltip } from 'antd';
import UserListItem from 'components/List/UserListItem';
import FailureNotification from 'components/Notification/FailureNotification';
import { Invite, InviteRes } from 'interfaces/friend.interface';
import React, { useEffect, useState } from 'react';
import { friendService } from 'services/friend.api';
import 'pages/Friend/Content/style.css';
import { DeleteOutlined } from '@ant-design/icons';
import SuccessNotification from 'components/Notification/SuccessNotification';

export default function InviteSentList() {
  const [invites, setInvite] = useState<Invite[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const limit = 10;

  const loadInviteSent = (page: number) => {
    setLoading(true);

    friendService
      .getInviteSent({ limit, page })
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
    loadInviteSent(1);
  }, []);

  const onChange: PaginationProps['onChange'] = (page: number) => {
    loadInviteSent(page);
  };

  const confirm = (inviteId: string) => {
    setLoading(true);
    friendService
      .deleteInvite(inviteId)
      .then(() => {
        setLoading(false);
        SuccessNotification({
          message: 'Ação concluída com sucesso!',
          description: 'Seu convite foi removido',
        });
        loadInviteSent(1);
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
            'Parece que não há convites de amizade enviados no momento. Continue explorando e fazendo novas conexões!',
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
            <Tooltip title="Remover convite">
              <Button
                shape="circle"
                icon={<DeleteOutlined />}
                aria-label="Remover convite"
                style={{ color: '#cf1322' }}
                onClick={() => confirm(item.id)}
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
