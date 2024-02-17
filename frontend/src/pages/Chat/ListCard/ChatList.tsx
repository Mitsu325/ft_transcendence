import React, { useEffect, useState } from 'react';
import { List, Divider, Select, SelectProps } from 'antd';
import UserListItem from 'components/List/UserListItem';
import { chatService } from 'services/chat.api';
import FailureNotification from 'components/Notification/FailureNotification';
import { chatSocket } from 'socket';
import { userService } from 'services/user.api';
import { Chat, ChattingUser } from 'interfaces/chat.interface';

interface UserStatus {
  id: string;
  status: 'online' | 'playing' | 'offline';
}

interface ChatListProps {
  userStatus: UserStatus[];
  reloadUsers: boolean;
  selectedUser: ChattingUser | undefined;
  handleUserClick: (chattingUser?: ChattingUser) => void;
}

export default function ChatList({
  userStatus,
  selectedUser,
  handleUserClick,
  reloadUsers,
}: ChatListProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [users, setUsers] = useState<SelectProps['options']>([]);
  const [searchValue, setSearchValue] = useState<string>();
  let timeout: ReturnType<typeof setTimeout> | null;
  let currentSearchValue: string;

  const getRecipients = () => {
    chatService
      .getRecipients()
      .then(res => {
        setChats(res);
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
    getRecipients();
  }, []);

  useEffect(() => {
    getRecipients();
  }, [reloadUsers]);

  useEffect(() => {
    chatSocket.on('message', ({ senderId, message }) => {
      setChats(prevChat => [
        {
          chatUser: message.senderUser,
          text: message.text,
          date: message.hour,
        },
        ...prevChat.filter(chat => chat.chatUser.id !== senderId),
      ]);
    });

    chatSocket.on('send-message', ({ recipient, message }) => {
      setChats(prevChat => [
        {
          chatUser: recipient,
          text: message.text,
          date: message.hour,
        },
        ...prevChat.filter(chat => chat.chatUser.id !== recipient.id),
      ]);
    });

    return () => {
      chatSocket.off('message');
      chatSocket.off('send-message');
    };
  }, [selectedUser]);

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
      userService.getUserById(newValue).then(res => {
        if (res) {
          handleUserClick(res);
        }
      });
    }
  };

  return (
    <>
      <Select
        showSearch
        allowClear
        placeholder="Buscar"
        className="input-search mt-12 mb-1"
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
      <Divider className="border-dark mt-12 mb-1" />
      <List
        className="chat-list"
        itemLayout="horizontal"
        dataSource={chats}
        renderItem={item => (
          <UserListItem
            userStatus={
              userStatus.find(statusData => statusData.id === item.chatUser.id)
                ?.status || 'offline'
            }
            itemClassName="user-item"
            active={selectedUser?.id === item.chatUser.id}
            avatar={item.chatUser.avatar}
            title={item.chatUser.name}
            description={item.text}
            date={item.date}
            username={item.chatUser.username}
            onUserClick={() => handleUserClick(item.chatUser)}
          />
        )}
      />
    </>
  );
}
