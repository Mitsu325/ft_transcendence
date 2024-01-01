import React, { useEffect, useState } from 'react';
import { List, Divider, Select, SelectProps } from 'antd';
import UserListItem from 'components/List/UserListItem';
import { chatService } from 'services/chat.api';
import FailureNotification from 'components/Notification/FailureNotification';
import { socket } from 'socket';
import { userService } from 'services/user.api';

type ChattingUser = {
  id: string;
  avatar: string;
  name: string;
  username?: string;
};

interface ChatListProps {
  selectedUser: ChattingUser | undefined;
  handleUserClick: (chattingUser?: ChattingUser) => void;
}

type Chat = {
  chatUser: {
    id: string;
    avatar: string;
    name: string;
    username?: string;
  };
  text: string;
  date: string;
};

export default function ChatList({
  selectedUser,
  handleUserClick,
}: ChatListProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [users, setUsers] = useState<SelectProps['options']>([]);
  const [searchValue, setSearchValue] = useState<string>();
  let timeout: ReturnType<typeof setTimeout> | null;
  let currentSearchValue: string;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await chatService.getRecipients();
        setChats(res);
      } catch (error) {
        FailureNotification({
          message: 'Ops! Encontramos algumas falhas durante o processo',
          description:
            'Não foi possível carregar as informações. Verifique sua conexão e tente novamente',
        });
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    socket.on('message', ({ senderId, message }) => {
      setChats(prevChat => [
        {
          chatUser: message.senderUser,
          text: message.text,
          date: message.hour,
        },
        ...prevChat.filter(chat => chat.chatUser.id !== senderId),
      ]);
    });

    socket.on('send-message', ({ recipient, message }) => {
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
      socket.off('message');
      socket.off('send-message');
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
        className="chat-list scroll"
        itemLayout="horizontal"
        dataSource={chats}
        renderItem={item => (
          <UserListItem
            active={selectedUser?.id === item.chatUser.id}
            avatar={item.chatUser.avatar}
            title={item.chatUser.name}
            description={item.text}
            date={item.date}
            onUserClick={() => handleUserClick(item.chatUser)}
          />
        )}
      />
    </>
  );
}
