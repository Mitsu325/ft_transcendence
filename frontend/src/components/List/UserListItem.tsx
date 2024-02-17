import React, { useEffect, useState } from 'react';
import { List } from 'antd';
import AvatarCustom from 'components/Avatar';
import 'components/List/style.css';

type UserListProps = {
  userStatus?: 'online' | 'playing' | 'offline';
  avatar: string;
  title: string;
  description?: string;
  date?: string;
  active: boolean;
  username?: string;
  itemClassName?: string;
  onUserClick?: () => void;
  children?: React.ReactNode;
};

type UserStatusClass = 'status-online' | 'status-playing' | 'status-offline';

const UserListItem = ({
  userStatus,
  avatar,
  title,
  description,
  date,
  active,
  username,
  itemClassName,
  onUserClick,
  children,
}: UserListProps) => {
  const [status, setStatus] = useState<UserStatusClass>('status-offline');

  useEffect(() => {
    switch (userStatus) {
      case 'online':
        setStatus('status-online');
        break;
      case 'playing':
        setStatus('status-playing');
        break;
      case 'offline':
        setStatus('status-offline');
        break;
      default:
        setStatus('status-offline');
        break;
    }
  }, [userStatus]);

  return (
    <List.Item
      className={['px-10', itemClassName, active && 'user-item-active'].join(
        ' ',
      )}
      onClick={onUserClick}
    >
      <List.Item.Meta
        avatar={
          userStatus ? (
            <div className="avatar-badge">
              <AvatarCustom src={avatar} size={48} />
              <div className={'badge ' + status}></div>
            </div>
          ) : (
            <AvatarCustom src={avatar} size={48} />
          )
        }
        title={
          <a
            href={'/profile/' + username}
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
      {children}
    </List.Item>
  );
};

export default UserListItem;
