import * as React from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from 'hooks/useAuth';
import PlayerCard from 'components/PlayerCard';
import RoomCard from 'components/RoomCard';
import { Button, Modal } from 'antd';
import LeaveRoomModal from 'components/Modal/LeaveRoomModal';
import Court from 'components/Court';
import {
  RoomGame,
  GameData,
  MatchPadles,
  MatchScores,
  MatchLevel,
  Ball,
  initialPadles,
  initialBall,
  initialScores,
  Players,
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
  const [roomOpen, setRoomOpen] = React.useState<string>('');
  const [players, setPlayers] = React.useState<Players>({
    player1: 'Anfitrião',
    player2: 'Convidado',
  });
  const [balls, setBalls] = React.useState<{ [roomId: string]: Ball }>({
    [socket.id]: initialBall,
  });
  const [padles, setPadles] = React.useState<{ [roomId: string]: MatchPadles }>(
    { ['0']: initialPadles },
  );
  const [scores, setScores] = React.useState<{ [roomId: string]: MatchScores }>(
    { ['0']: initialScores },
  );
  const [level, setLevel] = React.useState<{ [roomId: string]: MatchLevel }>({
    ['0']: { level: 1 },
  });

  const [newMessage, setNewMessage] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [messageOpen, setMessageOpen] = React.useState(visible);

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

    socket.on('cleanRoom', receivedRoom => {
      setScores({ [receivedRoom.room_id]: receivedRoom.scores });
      setBalls({ [receivedRoom.room_id]: receivedRoom.ball });
      setPadles({ [receivedRoom.room_id]: receivedRoom.padles });
    });

    socket.on('roomOpen', roomId => {
      setRoomOpen(roomId);
    });

    socket.on('matchStarted', (roomId, recevedBall) => {
      setBalls(prevBalls => ({
        ...prevBalls,
        [roomId]: recevedBall,
      }));
    });

    socket.on('players', (player1, player2) => {
      setPlayers({
        player1: player1.name,
        player2: player2?.name ?? '',
      });
    });

    socket.on('movePadles', (roomId, receivedPadles) => {
      setPadles(prevPadles => ({
        ...prevPadles,
        [roomId]: {
          ...(prevPadles[roomId] || {}),
          ...receivedPadles,
        },
      }));
    });

    socket.on('matchScores', (roomId, receivedScores) => {
      setScores(prevScores => ({
        ...prevScores,
        [roomId]: {
          ...(prevScores[roomId] || {}),
          ...receivedScores,
        },
      }));
    });

    socket.on('matchLevel', (roomId, receivedLevel) => {
      setLevel(prevLevel => ({
        ...prevLevel,
        [roomId]: {
          ...(prevLevel[roomId] || {}),
          ...receivedLevel,
        },
      }));
    });

    socket.on('ping', () => {
      console.log('ping');
    });

    socket.on('message', message => {
      setMessageOpen(true);
      setMessage(message);
    });

    return () => {
      socket.disconnect();
      setNewMessage('Seu adversário se desconectou');
      setGameData(prevGameData => ({
        ...prevGameData,
        connected: false,
        status: 'DISCONNECTED',
      }));
    };
  }, [user]);

  const createRoom = () => {
    setGameData(prevGameData => ({
      ...prevGameData,
      status: 'CREATED',
      message: 'Sala criada',
      match: true,
    }));
    socket.emit('CreateRoom', userPlayer);
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

  const matchMakerRequest = () => {
    socket.emit('requestRoomOpen', userPlayer);
  };

  React.useEffect(() => {
    if (roomOpen !== '') {
      const room = gameData.rooms.find(
        room => room.room_id === roomOpen && room.player2 === null,
      );
      if (room) {
        getInRoom(room);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomOpen]);

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

  const sendLevel = (level: number) => {
    const player = userPlayer.id;
    const room = userRoomId;
    const matchLevel = {
      level,
      player,
      room,
    };
    socket.emit('sendLevel', matchLevel);
  };

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
          <h2>
            {players.player1} X {players.player2}
          </h2>
          <div>
            <Court
              roomId={userRoomId}
              matchBall={balls[userRoomId]}
              matchPadles={padles[userRoomId]}
              matchScores={scores[userRoomId]}
              matchLevel={level[userRoomId]}
              onSendKey={sendKey}
              onSendLevel={sendLevel}
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
            <h2 style={{ padding: '10px' }}>
              {user?.name && user.name.toUpperCase()}
            </h2>
            <h2 style={{ padding: '20px' }}>*** JOGADORES ***</h2>
            <div className="players-container">
              {gameData.players.map(player => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>
            <div>
              <Button onClick={matchMakerRequest}>Encontrar Adversário</Button>
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
          <div>
            <Modal
              title="Aviso!"
              open={messageOpen}
              onOk={() => setMessageOpen(false)}
              onCancel={() => setMessageOpen(false)}
            >
              <p>{message}</p>
            </Modal>
          </div>
        </div>
      )}
    </>
  );
};
