import * as React from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from 'hooks/useAuth';
import PlayerCard from 'components/PlayerCard';
import RoomCard from 'components/RoomCard';
import { Button } from 'antd';
import LeaveRoomModal from 'components/Modal/LeaveRoomModal';
import Court from 'components/Court';
import {
  RoomGame,
  GameData,
  MatchPadles,
  Ball,
  initialPadles,
  initialBall,
} from 'interfaces/gameInterfaces/interfaces';
import './style.css';

let socket: Socket;

export const Game = () => {
  const user = useAuth()?.user;

  const userPlayer = React.useMemo(() => {
    const newPlayer = {
      id: user?.id ?? '',
      name: user?.name ?? '',
      avatar: user?.avatar ?? null,
    };
    return newPlayer;
  }, [user]);

  const [gameData, setGameData] = React.useState<GameData>({
    players: [],
    rooms: [],
    status: '',
    match: false,
    connected: false,
    message: '',
  });

  socket = React.useMemo(() => {
    const newSocket = io('http://localhost:3003', {
      reconnectionDelay: 10000,
    });
    return newSocket;
  }, []);

  const [userRoomId, setUserRoomId] = React.useState<string>(socket.id);
  const [balls, setBalls] = React.useState<{ [roomId: string]: Ball }>({
    [socket.id]: initialBall,
  });
  const [padles, setPadles] = React.useState<{ [roomId: string]: MatchPadles }>(
    { [socket.id]: initialPadles },
  );
  const [newMessage, setNewMessage] = React.useState('');
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    setVisible(true);
  }, [newMessage]);

  React.useEffect(() => {
    socket.on('connect', () => {
      socket.emit('PlayerConnected', user);
      setGameData(prevGameData => ({
        ...prevGameData,
        connected: true,
        status: 'CONNECTED',
      }));
    });

    socket.on('ping', (latency: number) => {
      if (latency !== undefined) {
        socket.emit('pong', latency);
      } else {
        socket.emit('ping');
      }
    });

    socket.on('game', (receivedGame: GameData) => {
      const playersArray = Object.values(receivedGame.players);
      const roomsArray = Object.values(receivedGame.rooms);

      setGameData(prevGameData => ({
        ...prevGameData,
        players: playersArray,
        rooms: roomsArray,
      }));
    });

    socket.on('playerLeftRoom', (data: { message: string }) => {
      setNewMessage(data.message);

      setGameData(prevGameData => ({
        ...prevGameData,
        status: 'LEAVE',
        message: data.message,
        match: false,
      }));
    });

    socket.on('matchStarted', (roomId, recevedBall) => {
      setBalls(prevBalls => ({
        ...prevBalls,
        [roomId]: recevedBall,
      }));
    });

    // socket.on('matchStarted', (roomId, ball) => {
    //   console.log('matchStarted', roomId, ball);
    // });

    socket.on('movePadles', (roomId, receivedPadles) => {
      setPadles(prevPadles => ({
        ...prevPadles,
        [roomId]: receivedPadles,
      }));
    });

    socket.on('ping', () => {
      console.log('ping');
    });

    return () => {
      socket.disconnect();
      setNewMessage('Seu adversário se desconectou');
      setGameData(prevGameData => ({
        ...prevGameData,
        connected: false,
        status: 'DISCONNECTED',
      }));
      console.log(gameData);
    };
  }, [user]);

  const createRoom = () => {
    socket.emit('CreateRoom', userPlayer);
    setGameData(prevGameData => ({
      ...prevGameData,
      match: true,
    }));
    setUserRoomId(socket.id);
  };

  const getInRoom = (room: RoomGame) => {
    if (userPlayer.id !== room.player1.id && room.player2 === null) {
      room.player2 = userPlayer;
      socket.emit('GetInRoom', room);
      setGameData(prevGameData => ({
        ...prevGameData,
        match: true,
      }));
    } else {
      setNewMessage('');
      setNewMessage('Sala ocupada');
    }
    let room_id = socket.id;
    gameData.rooms.forEach(room => {
      if (room.player2?.id === userPlayer.id) {
        room_id = room.room_id;
      }
    });
    setUserRoomId(room_id);
    startMatch(room_id);
  };

  const leaveRoom = () => {
    const roomIndex = gameData.rooms.findIndex(
      room => room.room_id === userRoomId,
    );
    if (roomIndex !== -1) {
      gameData.rooms.splice(roomIndex, 1);
    }
    socket.emit('leaveRoom', { userPlayer, userRoomId });
  };

  const startMatch = (room_id: string) => {
    socket.emit('startMatch', room_id);
  };

  const sendKey = (type: string, key: string) => {
    const player = userPlayer.id;
    const room = userRoomId;
    const padleObj = {
      type,
      key,
      player,
      room,
    };
    socket.emit('sendKey', padleObj);
  };

  // React.useEffect(() => {
  //   console.log('balls', balls);
  // }, [balls]);

  return (
    <>
      {gameData.match && gameData.connected ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '50vh',
          }}
        >
          <h1 style={{ padding: '20px' }}>*** PONG ***</h1>
          <div>
            <Court
              roomId={userRoomId}
              matchBall={balls[userRoomId]}
              matchPadles={padles[userRoomId]}
              onSendKey={sendKey}
            />
          </div>
          <div style={{ padding: '20px' }}>
            <Button onClick={leaveRoom}>Sair da sala</Button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', width: '100%' }}>
          <div style={{ flex: '70%', marginRight: '30px' }}>
            <h1 style={{ padding: '20px' }}>LOUNGE</h1>
            <h2 style={{ padding: '20px' }}>*** JOGADORES ***</h2>
            <div className="players-container">
              {gameData.players.map(player => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>
            <h2 style={{ padding: '20px' }}>*** SALAS ***</h2>
            <div>
              <Button onClick={createRoom}>Criar sala</Button>
            </div>
            <div className="rooms-container">
              {gameData.rooms.map(room => (
                <RoomCard
                  key={room.room_id}
                  room={room}
                  getInRoom={getInRoom}
                />
              ))}
            </div>
          </div>
          <div>
            <LeaveRoomModal visible={visible} message={newMessage} />
          </div>
        </div>
      )}
    </>
  );
};
