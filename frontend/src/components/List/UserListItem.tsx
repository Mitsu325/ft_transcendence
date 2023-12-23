import React from 'react';
import { List } from 'antd';
import AvatarCustom from 'components/Avatar';
import 'components/List/style.css';

type UserListProps = {
  avatar: string;
  title: string;
  description?: string;
  date?: string;
  onUserClick?: () => void;
};

// TODO: title seguir para detalhes do perfil ao clicar
const UserListItem = ({
  avatar,
  title,
  description,
  date,
  onUserClick,
}: UserListProps) => {
  return (
    <List.Item className="px-10 user-item" onClick={onUserClick}>
      <List.Item.Meta
        avatar={<AvatarCustom src={avatar} size={48} />}
        title={
          <a
            href="#"
            style={{ color: '#001529', transition: 'color 0.5s' }}
            onMouseEnter={e =>
              ((e.target as HTMLElement).style.color = '#1677ff')
            }
            onMouseLeave={e =>
              ((e.target as HTMLElement).style.color = '#001529')
            }
          >
            {title}
          </a>
        }
        description={<p className="text-description">{description}</p>}
      />
      <span className="text-details">{date}</span>
    </List.Item>
  );
};

export default UserListItem;
