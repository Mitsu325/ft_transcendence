import React, { useEffect, useRef } from 'react';
import { Divider, List } from 'antd';
import AvatarCustom from 'components/Avatar';
import MessageBox from 'components/Message/MessageBox';
import MessageInput from 'components/Message/MessageInput';

type DividerMessage = {
  type: 'divider';
  text: string;
};

type TextMessage = {
  id: string;
  type: 'text';
  text: string;
  senderUser: {
    id: string;
    avatar: string;
    name: string;
  };
  hour: string;
};

type Message = DividerMessage | TextMessage;

const data: Message[] = [
  {
    type: 'divider',
    text: '19/12/2023',
  },
  {
    id: 'abc',
    type: 'text',
    senderUser: {
      id: '789',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      name: 'Mona',
    },
    text: 'Hey!!',
    hour: '14:30',
  },
  {
    type: 'divider',
    text: '20/12/2023',
  },
  {
    id: 'def',
    type: 'text',
    senderUser: {
      id: '456',
      avatar: '',
      name: 'Paty',
    },
    text: 'Maio',
    hour: '14:20',
  },
  {
    id: 'ghi',
    type: 'text',
    senderUser: {
      id: '789',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      name: 'Mona',
    },
    text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
    hour: '14:22',
  },
  {
    type: 'divider',
    text: '25/12/2023',
  },
  {
    id: 'defgh',
    type: 'text',
    senderUser: {
      id: '456',
      avatar: '',
      name: 'Paty',
    },
    text: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which dont look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isnt anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.',
    hour: '10:00',
  },
  {
    id: 'ghidae',
    type: 'text',
    senderUser: {
      id: '789',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      name: 'Mona',
    },
    text: 'In sollicitudin congue vestibulum. Quisque suscipit accumsan efficitur. Suspendisse finibus lacus ac neque pretium luctus. Duis ornare vel est vel cursus. Nam tincidunt leo leo, eu fermentum nisi vehicula quis. Pellentesque egestas sed felis eget efficitur. Praesent eu erat erat. Nunc eget libero gravida, ultricies lacus sit amet, pharetra enim. Sed viverra sit amet ante eu congue. Curabitur faucibus orci felis, ut vulputate ligula consectetur pretium. Phasellus sed commodo est. Proin vel rutrum odio. Quisque tellus eros, scelerisque et cursus quis, consectetur ac magna. Aenean non dolor non felis cursus porttitor. Nunc sodales elementum pellentesque.',
    hour: '10:22',
  },
];

// TODO: listar os elementos do antigo para o novo
// TODO: iniciar scroll de baixo para cima

export default function MessageList({
  selectedUser,
}: {
  selectedUser: string;
}) {
  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('Ref');
    //  TODO: no lugar disso usar a lib: InfiniteScroll
    return chatBoxRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  }, []);

  // TODO: buscar mensagens
  console.log(selectedUser);

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

  return (
    <>
      <div className="message-header">
        <AvatarCustom
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
          size={48}
        />
        <h1 className="title ml-12">Mona</h1>
      </div>
      <Divider className="border-dark m-0" />
      <List
        className="message-list scroll"
        itemLayout="horizontal"
        dataSource={data}
        renderItem={item => renderComponent(item)}
      />
      <Divider className="border-dark m-0" />
      <MessageInput />
    </>
  );
}
