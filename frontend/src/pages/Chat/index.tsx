import React, { useEffect, useMemo, useState } from 'react';
import ListCard from './ListCard';
import 'pages/Chat/style.css';
import MessageCard from './MessageCard';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Chat() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );
  const [selectedMenuItem, setSelectedMenuItem] = useState(
    queryParams.get('menu') || 'channel',
  );
  const [selectedUser, setSelectedUser] = useState<string | undefined>();

  const handleMenuClick = (key: string) => {
    setSelectedMenuItem(key);
    queryParams.set('menu', key);
    navigate(`?${queryParams.toString()}`);
  };

  const handleUserClick = (userId?: string) => {
    setSelectedUser(userId);
  };

  useEffect(() => {
    const storedMenuItem = queryParams.get('menu') || 'channel';
    setSelectedMenuItem(storedMenuItem);
  }, [queryParams]);

  return (
    <div className="channel-grid">
      <ListCard
        selectedMenu={selectedMenuItem}
        handleMenuClick={handleMenuClick}
        handleUserClick={handleUserClick}
      />
      <MessageCard
        selectedMenu={selectedMenuItem}
        selectedUser={selectedUser}
      />
    </div>
  );
}
