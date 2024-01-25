import React, { useState } from 'react';
import { Button, Select, SelectProps } from 'antd';
import { userService } from 'services/user.api';
import 'pages/Friend/Content/style.css';
import { friendService } from 'services/friend.api';
import FailureNotification from 'components/Notification/FailureNotification';
import { CreateInvite } from 'interfaces/friend.interface';
import SuccessNotification from 'components/Notification/SuccessNotification';
import WarningNotification from 'components/Notification/WarningNotification';

export default function FriendInvite() {
  const [users, setUsers] = useState<SelectProps['options']>([]);
  const [searchValue, setSearchValue] = useState<string>();
  const [enableInvite, setEnableInvite] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  let timeout: ReturnType<typeof setTimeout> | null;
  let currentSearchValue: string;

  const handleSearch = (newValue: string) => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    currentSearchValue = newValue;

    const getUsers = () => {
      userService.searchUserByName(newValue).then(res => {
        if (currentSearchValue === newValue) {
          setUsers(res);
        }
      });
    };

    if (newValue) {
      timeout = setTimeout(getUsers, 300);
    } else {
      setUsers([]);
    }
  };

  const handleChange = (newValue: string) => {
    if (newValue) {
      setSearchValue(newValue);
      setEnableInvite(true);
    }
  };

  const sendInvite = () => {
    setLoading(true);
    friendService
      .invite({ recipientId: searchValue || '' })
      .then((res: CreateInvite) => {
        setLoading(false);
        if (res?.status === 'success') {
          SuccessNotification({
            message: 'Pedido de Amizade Enviado',
            description:
              'Seu convite foi enviado com sucesso! Agora, é só aguardar a resposta.',
          });
        } else if (res.invite && res.invite.status) {
          if (res.invite.status === 'active') {
            WarningNotification({
              message: 'Ops, parece que algo deu errado',
              description:
                'Parece que vocês já são amigos. Nada como manter boas conexões!',
            });
          } else if (res.invite.status === 'pending') {
            WarningNotification({
              message: 'Ops, parece que algo deu errado',
              description:
                'Já existe um pedido pendente para essa pessoa, agora é so aguardar a resposta!',
            });
          }
        }
        setSearchValue('');
        setEnableInvite(false);
      })
      .catch(() => {
        setLoading(false);
        setSearchValue('');
        setEnableInvite(false);
        FailureNotification({
          message: 'Ops! Encontramos algumas falhas durante o processo',
          description:
            'Não foi possível enviar o pedido amizade. Verifique sua conexão e tente novamente',
        });
      });
  };

  return (
    <>
      <p>Envie convites aos seus amigos e amplie sua rede de conexões.</p>
      <div className="friend-search-group">
        <Select
          showSearch
          allowClear
          placeholder="Buscar"
          className="friend-search"
          value={searchValue}
          defaultActiveFirstOption={false}
          suffixIcon={null}
          filterOption={false}
          onSearch={handleSearch}
          onChange={handleChange}
          options={(users || []).map(user => ({
            value: user.id,
            label: user.username
              ? `${user.name} | ${user.username}`
              : user.name,
          }))}
        />
        <Button
          type="primary"
          disabled={!enableInvite}
          loading={loading}
          onClick={sendInvite}
        >
          Enviar pedido de amizade
        </Button>
      </div>
    </>
  );
}
