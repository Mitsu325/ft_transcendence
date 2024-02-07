import {
  Button,
  DatePicker,
  DatePickerProps,
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
import {
  ActionType,
  AdminAction,
  AdminActionRes,
} from 'interfaces/channel.interface';
import { adminService } from 'services/admin.api';
import WarningNotification from 'components/Notification/WarningNotification';
import { userService } from 'services/user.api';
import { UpdateAdminAction } from 'interfaces/reqBody/admin-action.interface';

export default function AdminActionList({
  channelId,
  action,
}: {
  channelId: string;
  action: ActionType;
}) {
  const [adminActions, setAdminActions] = useState<AdminAction[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const limit = 10;
  const [users, setUsers] = useState<SelectProps['options']>([]);
  const [searchValue, setSearchValue] = useState<string>();
  const [expirationDate, setExpirationDate] = useState<Date | null>();
  const [enableAction, setEnableAction] = useState<boolean>(false);
  const [emptyText, setEmptytext] = useState<string>(
    'Sem membros com essa ação',
  );
  const [btnText, setBtnText] = useState<string>('');
  const [confirmText, setConfirmText] = useState<string>('');
  let timeout: ReturnType<typeof setTimeout> | null;
  let currentSearchValue: string;

  useEffect(() => {
    loadAdminActions(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId, action]);

  useEffect(() => {
    switch (action) {
      case 'mute':
        setBtnText('Silenciar');
        setEmptytext('Nenhum membro está atualmente silenciado na comunidade.');
        setConfirmText('Remover silenciamento');
        break;
      case 'kick':
        setBtnText('Expulsar');
        setEmptytext('Nenhum membro foi expulso da comunidade.');
        setConfirmText('Remover expulsão');
        break;
      case 'ban':
        setBtnText('Banir');
        setEmptytext('Nenhum membro foi banido permanentemente da comunidade.');
        setConfirmText('Remover banimento');
        break;
      default:
        break;
    }
  }, [action]);

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
      if (action === 'mute') {
        setEnableAction(!!expirationDate);
      } else {
        setEnableAction(true);
      }
    }
  };

  const loadAdminActions = (page: number) => {
    setLoading(true);

    adminService
      .getAdminActions(channelId, action, { limit, page })
      .then((res: AdminActionRes) => {
        setAdminActions(res.data);
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

  const onChangePagination: PaginationProps['onChange'] = (page: number) => {
    loadAdminActions(page);
  };

  const addAdminAction = () => {
    if ((action === 'mute' && !expirationDate) || !searchValue) return;

    setLoading(true);

    const params: UpdateAdminAction = {
      channelId,
      action,
      memberId: searchValue,
      active: true,
      expirationDate: null,
    };
    if (action === 'mute' && expirationDate) {
      params['expirationDate'] = expirationDate;
    }

    adminService
      .updateAdminActions(params)
      .then(res => {
        if (res.status === 'success') {
          loadAdminActions(1);
          SuccessNotification({
            message: 'Ok',
            description: 'Ação aplicada com sucesso',
          });
        } else {
          WarningNotification({
            message: `Não foi possível ${
              action === 'mute'
                ? 'silenciar'
                : action === 'kick'
                ? 'expulsar'
                : 'banir'
            }`,
            description: res.message,
          });
        }
      })
      .catch(() => {
        FailureNotification({
          message: 'Ops, algo deu errado',
          description: `Não foi possível ${
            action === 'mute'
              ? 'silenciar'
              : action === 'kick'
              ? 'expulsar'
              : 'banir'
          }`,
        });
      })
      .finally(() => {
        setLoading(false);
        setSearchValue('');
        setEnableAction(false);
      });
  };

  const onChangeDate: DatePickerProps['onChange'] = (date, dateString) => {
    if (dateString) {
      setExpirationDate(new Date(dateString));
      setEnableAction(!!searchValue);
    } else {
      setExpirationDate(null);
      setEnableAction(false);
    }
  };

  const confirm = async (memberId: string) => {
    if (action === 'ban') return;

    setLoading(true);

    const params: UpdateAdminAction = {
      channelId,
      action,
      memberId,
      active: false,
      expirationDate: null,
    };

    adminService
      .updateAdminActions(params)
      .then(res => {
        if (res.status === 'success') {
          loadAdminActions(1);
          SuccessNotification({
            message: 'Ok',
            description: `${
              action === 'mute'
                ? 'Silenciamento'
                : action === 'kick'
                ? 'Expulsão'
                : 'Banimento'
            } removido com sucesso`,
          });
        } else {
          WarningNotification({
            message: `Não foi possível remover o ${
              action === 'mute'
                ? 'silenciamento'
                : action === 'kick'
                ? 'expulsão'
                : 'banimento'
            }`,
            description: res.message,
          });
        }
      })
      .catch(() => {
        FailureNotification({
          message: 'Ops, algo deu errado',
          description: `Não foi possível remover o ${
            action === 'mute'
              ? 'silenciamento'
              : action === 'kick'
              ? 'expulsão'
              : 'banimento'
          }`,
        });
      })
      .finally(() => {
        setLoading(false);
      });
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
        {action === 'mute' && (
          <DatePicker
            placeholder="Fim do silenciamento"
            className="date-input"
            onChange={onChangeDate}
            showTime
          />
        )}
        <Button
          type="primary"
          disabled={!enableAction}
          loading={loading}
          onClick={addAdminAction}
        >
          {btnText}
        </Button>
      </div>
      <List
        dataSource={adminActions}
        locale={{
          emptyText,
        }}
        renderItem={item => (
          <UserListItem
            active={false}
            avatar={item.member.avatar}
            title={item.member.name}
            description={
              item.member.username +
              (action === 'mute' ? ' | Expira em: ' + item.expirationDate : '')
            }
            username={item.member.username}
            itemClassName="gray"
          >
            {action !== 'ban' && (
              <Popconfirm
                title={confirmText}
                description="Você tem certeza que deseja continuar?"
                onConfirm={() => confirm(item.member.id)}
                okText="Sim"
                cancelText="Não"
              >
                <Button
                  shape="circle"
                  icon={<LineOutlined />}
                  aria-label={confirmText}
                  style={{ color: '#cf1322' }}
                />
              </Popconfirm>
            )}
          </UserListItem>
        )}
      />
      <Pagination
        className="pagination"
        defaultCurrent={1}
        pageSize={limit}
        total={total}
        onChange={onChangePagination}
        disabled={loading}
        hideOnSinglePage
      />
    </>
  );
}
