import * as React from 'react';
import { useAuth } from 'hooks/useAuth';
import { userService } from '../services/user.api';

export interface User_Status {
  id: string;
  status: string;
}

export const UserStatusUpdater = () => {
  const user = useAuth()?.user;

  const userPlayer = React.useMemo(() => {
    const newPlayer = {
      id: user?.id ?? '',
    };
    return newPlayer;
  }, [user]);

  const [startTime, setStartTime] = React.useState<number>();
  const [userStatus, setUserStatus] = React.useState<string>('online');

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      const currentTime = Date.now();

      if (currentTime && startTime && startTime < currentTime) {
        let timeSleep = Math.floor((currentTime - startTime) / 1000);

        if (timeSleep > 10 && userStatus === 'online') {
          setUserStatus('offline');
          timeSleep = 0;
        } else if (timeSleep <= 10 && userStatus === 'offline') {
          setUserStatus('online');
          timeSleep = 0;
        }
      }
    }, 12000);

    return () => {
      clearInterval(intervalId);
    };
  }, [startTime, userStatus]);

  React.useEffect(() => {
    const status: User_Status = {
      id: userPlayer.id,
      status: userStatus,
    };

    async function updateUserStatus() {
      await userService.updateUserStatus(status);
    }

    updateUserStatus();

    // eslint-disable-next-line
  }, [userStatus]);

  React.useEffect(() => {
    function handleMouseOut() {
      setUserStatus('');
      setUserStatus('online');
      setStartTime(Date.now());
    }

    const sendKeyEvent = () => {
      setUserStatus('');
      setUserStatus('online');
      setStartTime(Date.now());
    };

    const detectedUnload = () => {
      setUserStatus('');
      setUserStatus('offline');
      setStartTime(Date.now());
    };

    window.addEventListener('mouseout', handleMouseOut);
    window.addEventListener('keydown', sendKeyEvent);
    window.addEventListener('beforeunload', () => {
      detectedUnload();
    });

    return () => {
      window.addEventListener('mouseout', handleMouseOut);
      window.addEventListener('keydown', sendKeyEvent);
      window.addEventListener('beforeunload', () => {
        detectedUnload();
      });
    };
  }, []);
};
