import React, { useEffect, useState } from 'react';
import { useAuth } from 'hooks/useAuth';
import UserModel from 'interfaces/userModel';
import { chatService } from 'services/chat.api';
import FailureNotification from 'components/Notification/FailureNotification';
import { BlockedUser } from 'interfaces/chat.interface';
import { Button, Divider, List, Popconfirm } from 'antd';
import UserListItem from 'components/List/UserListItem';
import { UserAddOutlined } from '@ant-design/icons';
import SuccessNotification from 'components/Notification/SuccessNotification';

export default function BlockUsers({
  userProfile,
}: {
  userProfile: UserModel | null;
}) {
  const { user } = useAuth();
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);

  const getBlockedUsers = () => {
    chatService
      .getBlockedUsers()
      .then(res => {
        setBlockedUsers(res);
      })
      .catch(() => {
        FailureNotification({
          message: 'Ops! Encontramos algumas falhas durante o processo',
          description:
            'Não foi possível carregar as informações. Verifique sua conexão e tente novamente',
        });
      });
  };

  useEffect(() => {
    getBlockedUsers();
  }, []);

  const confirm = (blockedId: string) => {
    chatService
      .updateBlockUser({ blockedId, active: false })
      .then(() => {
        getBlockedUsers();
        SuccessNotification({
          message: 'Usuário desbloqueado com sucesso!',
          description:
            'Agora você pode retomar a comunicação e interagir normalmente.',
        });
      })
      .catch(() => {
        FailureNotification({
          message: 'Ops! Encontramos algumas falhas durante o processo',
          description: 'Não foi possível desbloquear o usuário',
        });
      });
  };

  const renderContent = () => {
    if (user?.username === userProfile?.username) {
      return (
        <>
          <p className="profile-text mb-24">
            Usuários Bloqueados não podem ser contatados no chat. Se você deseja
            retomar a comunicação com algum usuário bloqueado, precisará
            desbloqueá-lo primeiro.
          </p>
          <List
            dataSource={blockedUsers}
            locale={{
              emptyText: 'Você não bloqueou nenhum usuário até agora.',
            }}
            renderItem={item => (
              <UserListItem
                active={false}
                avatar={item.blocked.avatar}
                title={item.blocked.name}
                description={item.blocked.username}
                username={item.blocked.username}
                itemClassName="gray"
              >
                <Popconfirm
                  title="Desbloquear"
                  description="Você tem certeza que deseja continuar?"
                  onConfirm={() => confirm(item.blocked.id)}
                  okText="Sim"
                  cancelText="Não"
                >
                  <Button
                    shape="circle"
                    icon={<UserAddOutlined />}
                    aria-label="Desbloquear"
                    style={{ color: '#389e0d' }}
                  />
                </Popconfirm>
              </UserListItem>
            )}
          />
        </>
      );
    }
    return (
      <p>
        Desculpe, você não tem permissão para editar as informações deste
        usuário. A edição está disponível apenas para o próprio usuário.
      </p>
    );
  };

  return (
    <>
      <h1 className="title">{userProfile?.name}</h1>
      <h2 className="sub-title">Contatos bloqueados</h2>
      <Divider />
      {renderContent()}
    </>
  );
}
