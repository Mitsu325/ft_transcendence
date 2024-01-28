import React, { useEffect, useRef, useState } from 'react';
import { Button, Divider, List, Popconfirm } from 'antd';
import AvatarCustom from 'components/Avatar';
import MessageBox from 'components/Message/MessageBox';
import MessageInput from 'components/Message/MessageInput';
import { chatService } from 'services/chat.api';
import FailureNotification from 'components/Notification/FailureNotification';
import { chatSocket } from 'socket';
import { useAuth } from 'hooks/useAuth';
import InfiniteScroll from 'components/InfiniteScroll';
import { ChattingUser, Message } from 'interfaces/chat.interface';
import { StopOutlined } from '@ant-design/icons';
import SuccessNotification from 'components/Notification/SuccessNotification';

interface MessageListProps {
  selectedUser: ChattingUser;
  setSelectedUser: React.Dispatch<
    React.SetStateAction<ChattingUser | undefined>
  >;
  onReloadUsers: () => void;
}

export default function MessageList({
  selectedUser,
  setSelectedUser,
  onReloadUsers,
}: MessageListProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const limit = 20;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInitialLoadComplete(false);
    chatService
      .getMessagesFromChattingUser(selectedUser.id, { page: 1, limit })
      .then(res => {
        setMessages(res);
        setPage(1);
        setInitialLoadComplete(true);
        if (res.length < limit) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      })
      .catch(() => {
        FailureNotification({
          message: 'Ops! Encontramos algumas falhas durante o processo',
          description:
            'Não foi possível carregar as informações. Verifique sua conexão e tente novamente',
        });
      });
  }, [selectedUser]);

  useEffect(() => {
    chatSocket.on('message', ({ senderId, message }) => {
      if (user?.id !== selectedUser.id && senderId === selectedUser.id) {
        setMessages(prevMessages => [...prevMessages, message]);
      }
    });

    return () => {
      chatSocket.off('message');
    };
  }, [selectedUser, user]);

  useEffect(() => {
    if (initialLoadComplete) {
      scrollToBottom();
    }
  }, [initialLoadComplete]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView();
    }
  };

  const renderComponent = (item: Message) => {
    if (item.type === 'text') {
      return (
        <MessageBox
          senderUser={item.senderUser}
          text={item.text}
          hour={item.hour}
        />
      );
    } else {
      return (
        <Divider
          style={{ fontSize: '0.8rem', color: '#5a5a5a', margin: '0' }}
          plain
        >
          {item.text}
        </Divider>
      );
    }
  };

  const sendMessage = (message: string) => {
    chatService
      .sendMessage({
        recipientId: selectedUser.id,
        message,
      })
      .then(res => {
        if (res) {
          setMessages([...messages, res]);
          chatSocket.emit('message', {
            recipientId: selectedUser.id,
            message: res,
          });
          if (user?.id !== selectedUser.id) {
            chatSocket.emit('send-message', {
              recipient: selectedUser,
              message: res,
            });
          }
        }
      })
      .catch(() => {
        FailureNotification({
          message: 'Ops! Não foi possível enviar a mensagem.',
          description: 'Verifique sua conexão e tente novamente',
        });
      });
  };

  const loadMoreMessages = async () => {
    try {
      const nextPage = page + 1;
      setPage(nextPage);
      const res = await chatService.getMessagesFromChattingUser(
        selectedUser.id,
        { page: nextPage, limit },
      );
      setMessages(prevMessages => [...res, ...prevMessages]);
      if (res.length < limit) {
        setHasMore(false);
      }
    } catch (error) {
      FailureNotification({
        message: 'Ops! Encontramos algumas falhas durante o processo',
        description:
          'Não foi possível carregar as informações. Verifique sua conexão e tente novamente',
      });
    }
  };

  const confirm = (userId: string) => {
    chatService
      .blockUser({ blockedId: userId })
      .then(() => {
        setSelectedUser(undefined);
        onReloadUsers();
        SuccessNotification({
          message: 'Usuário Bloqueado com Sucesso',
          description:
            'Agora, você não receberá mais interações dele. Caso mude de ideia, você pode gerenciar seus usuários bloqueados nas configurações da conta.',
        });
      })
      .catch(() => {
        FailureNotification({
          message: 'Ops! Não foi possível bloquear o usuário.',
          description: 'Verifique sua conexão e tente novamente',
        });
      });
  };

  return (
    <>
      <div className="message-header">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <AvatarCustom src={selectedUser.avatar} size={48} />
          <h1 className="message-header-title ml-12">{selectedUser.name}</h1>
        </div>
        {selectedUser.id !== user?.id && (
          <Popconfirm
            title={'Bloquear ' + selectedUser.name}
            description="Você tem certeza que deseja continuar?"
            onConfirm={() => confirm(selectedUser.id)}
            okText="Sim"
            cancelText="Não"
          >
            <Button
              shape="circle"
              icon={<StopOutlined />}
              aria-label="Bloquear"
              style={{ color: '#cf1322' }}
            />
          </Popconfirm>
        )}
      </div>
      <Divider className="border-dark m-0" />
      <InfiniteScroll
        customClassName={'message-list'}
        fetchMoreData={loadMoreMessages}
        hasMore={hasMore}
      >
        <List
          itemLayout="horizontal"
          dataSource={messages}
          renderItem={item => renderComponent(item)}
        />
        <div ref={messagesEndRef} />
      </InfiniteScroll>
      <Divider className="border-dark m-0" />
      <MessageInput handleClick={sendMessage} />
    </>
  );
}
