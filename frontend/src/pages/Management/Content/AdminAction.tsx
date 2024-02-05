import React, { useState } from 'react';
import { Button, Select, SelectProps } from 'antd';
import FailureNotification from 'components/Notification/FailureNotification';
import SuccessNotification from 'components/Notification/SuccessNotification';
import WarningNotification from 'components/Notification/WarningNotification';
import { userService } from 'services/user.api';
import { adminService } from 'services/admin.api';

export default function AdminAction({ channelId }: { channelId: string }) {
  const [users, setUsers] = useState<SelectProps['options']>([]);
  const [searchValue, setSearchValue] = useState<string>();
  const [enableAction, setEnableAction] = useState<boolean>(false);
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
      setEnableAction(true);
    }
  };

  const addAdmin = async () => {
    try {
      setLoading(true);
      if (searchValue) {
        const ret = await adminService.addAdmin({
          channel_id: channelId,
          admin_id: searchValue,
          active: true,
        });
        if (ret.success) {
          SuccessNotification({
            message: 'Ok',
            description: 'Adminstrador adicionado com sucesso',
          });
        } else {
          WarningNotification({
            message: 'Ops, parece que algo deu errado',
            description: 'Parece que a pessoa já é admin e está ativo.',
          });
        }
        setLoading(false);
        setSearchValue('');
        setEnableAction(false);
      }
    } catch (error) {
      FailureNotification({
        message: 'Ops! Encontramos algumas falhas durante o processo',
        description: 'Verifique sua conexão e tente novamente.',
      });
      setLoading(false);
      setSearchValue('');
      setEnableAction(false);
    }
  };

  return (
    <>
      <p className="mb-24">Procure uma pessoa e escolha a ação:</p>
      <Select
        showSearch
        allowClear
        placeholder="Buscar um usuário"
        className="friend-search"
        value={searchValue}
        defaultActiveFirstOption={false}
        suffixIcon={null}
        filterOption={false}
        onSearch={handleSearch}
        onChange={handleChange}
        options={(users || []).map(user => ({
          value: user.id,
          label: user.username ? `${user.name} | ${user.username}` : user.name,
        }))}
      />
      <Button
        type="primary"
        disabled={!enableAction}
        loading={loading}
        onClick={addAdmin}
        className="m-0"
      >
        Adicionar como Admin
      </Button>
    </>
  );
}
