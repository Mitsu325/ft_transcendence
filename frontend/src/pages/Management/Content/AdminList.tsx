import {
  Button,
  List,
  Pagination,
  PaginationProps,
  Popconfirm,
  Select,
  SelectProps,
} from 'antd';
import UserListItem from 'components/List/UserListItem';
import FailureNotification from 'components/Notification/FailureNotification';
import React, { useEffect, useState } from 'react';
import 'pages/Friend/Content/style.css';
import { LineOutlined } from '@ant-design/icons';
import SuccessNotification from 'components/Notification/SuccessNotification';
import { Admin, AdminRes } from 'interfaces/channel.interface';
import { adminService } from 'services/admin.api';
import WarningNotification from 'components/Notification/WarningNotification';
import { userService } from 'services/user.api';

export default function AdminList({ channelId }: { channelId: string }) {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const limit = 1;
  const [users, setUsers] = useState<SelectProps['options']>([]);
  const [searchValue, setSearchValue] = useState<string>();
  const [enableAction, setEnableAction] = useState<boolean>(false);
  let timeout: ReturnType<typeof setTimeout> | null;
  let currentSearchValue: string;

  useEffect(() => {
    loadAdmins(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId]);

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
            message: 'Ops, algo deu errado',
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

  const loadAdmins = (page: number) => {
    setLoading(true);

    adminService
      .getAdmins(channelId, { limit, page })
      .then((res: AdminRes) => {
        setAdmins(res.data);
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

  const onChange: PaginationProps['onChange'] = (page: number) => {
    loadAdmins(page);
  };

  const confirm = async (adminId: string) => {
    try {
      setLoading(true);
      const ret = await adminService.removeAdmin({
        channel_id: channelId,
        admin_id: adminId,
      });
      if (ret.success) {
        SuccessNotification({
          message: 'Ação concluída com sucesso!',
          description: 'Adminstrador removido com sucesso',
        });
        loadAdmins(1);
      } else {
        FailureNotification({
          message: 'Ops! Encontramos algumas falhas durante o processo',
          description: 'Administrador já removido ou inativo',
        });
      }
      setLoading(false);
    } catch (error) {
      FailureNotification({
        message: 'Ops! Encontramos algumas falhas durante o processo',
        description: 'Verifique sua conexão e tente novamente',
      });
      setLoading(false);
    }
  };

  return (
    <>
      <div className="admin-search-group">
        <Select
          showSearch
          allowClear
          placeholder="Buscar um usuário"
          className="admin-search"
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
          disabled={!enableAction}
          loading={loading}
          onClick={addAdmin}
        >
          Adicionar como Admin
        </Button>
      </div>
      <List
        dataSource={admins}
        locale={{
          emptyText: 'Sem administradores',
        }}
        renderItem={item => (
          <UserListItem
            active={false}
            avatar={item.admin.avatar}
            title={item.admin.name}
            description={item.admin.username}
            username={item.admin.username}
            itemClassName="gray"
          >
            <Popconfirm
              title="Deixar de ser admin"
              description="Você tem certeza que deseja continuar?"
              onConfirm={() => confirm(item.admin.id)}
              okText="Sim"
              cancelText="Não"
            >
              <Button
                shape="circle"
                icon={<LineOutlined />}
                aria-label="Deixar de ser admin"
                style={{ color: '#cf1322' }}
              />
            </Popconfirm>
          </UserListItem>
        )}
      />
      <Pagination
        className="pagination"
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
