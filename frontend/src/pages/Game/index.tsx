import React, { useEffect, useMemo, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from 'hooks/useAuth';
import PlayerCard from 'components/PlayerCard';
import RoomCard from 'components/RoomCard';
import { Button, Divider, Modal } from 'antd';
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
import { useSearchParams } from 'react-router-dom';
import { userService } from '../../services/user.api';

let socket: Socket;

export const Game = () => {
  const user = useAuth()?.user;
  const [searchParams, setSearchParams] = useSearchParams();

  const userPlayer = useMemo(() => {
    const newPlayer = {
      id: user?.id ?? '',
      name: user?.name ?? '',
      username: user?.username ?? '',
      avatar: user?.avatar ?? null,
    };
    return newPlayer;
  }, [user]);

  const [gameData, setGameData] = useState<GameData>({
    players: [],
    rooms: [],
    status: '',
    match: false,
    connected: false,
    message: '',
  });

  socket = useMemo(() => {
    const newSocket = io(`https://${process.env.VERCEL_URL || ''}`, {
      reconnectionDelay: 10000,
    });
    return newSocket;
  }, []);

  const [userRoomId, setUserRoomId] = useState<string>(socket.id);
  const [roomOpen, setRoomOpen] = useState<string>('');
  const [players, setPlayers] = useState<Players>({
    player1: 'Anfitrião',
    player2: 'Convidado',
  });
  const [balls, setBalls] = useState<{ [roomId: string]: Ball }>({
    [socket.id]: initialBall,
  });
  const [padles, setPadles] = useState<{ [roomId: string]: MatchPadles }>({
    ['0']: initialPadles,
  });
  const [scores, setScores] = useState<{ [roomId: string]: MatchScores }>({
    ['0']: initialScores,
  });
  const [level, setLevel] = useState<{ [roomId: string]: MatchLevel }>({
    ['0']: { level: 1 },
  });

  const [newMessage, setNewMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [messageOpen, setMessageOpen] = useState(visible);
  const [enable, setEnable] = useState(false);
  const [userStatus, setUserStatus] = React.useState('online');

  useEffect(() => {
    if (enable && searchParams.has('guestId')) {
      setGameData(prevGameData => ({
        ...prevGameData,
        status: 'CREATED',
        message: 'Sala criada',
        connected: true,
        match: true,
      }));
      socket.emit('CreateRoom', {
        user: userPlayer,
        guestId: searchParams.get('guestId'),
      });
      setUserRoomId(socket.id);
      searchParams.delete('guestId');
      setSearchParams(searchParams);
      setUserStatus('playing');
    }
    if (enable && searchParams.has('hostId')) {
      const hostId = searchParams.get('hostId');
      const room = gameData.rooms.find(
        item => item.player1.id === hostId && item.guestId === user?.id,
      );
      if (room) {
        room.player2 = userPlayer;
        socket.emit('GetInRoom', room);
        setGameData(prevGameData => ({
          ...prevGameData,
          match: true,
        }));
        setUserRoomId(room.room_id);
        searchParams.delete('hostId');
        setSearchParams(searchParams);
        startMatch(room.room_id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enable, searchParams]);

  useEffect(() => {
    if (searchParams.has('cleanRoom')) {
      leaveRoom();
      setGameData(prevGameData => ({
        ...prevGameData,
        status: 'LEAVE',
        match: false,
      }));
      searchParams.delete('cleanRoom');
      setSearchParams(searchParams);
      setVisible(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    setVisible(true);
  }, [newMessage]);

  useEffect(() => {
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

      setEnable(true);
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
      setRoomOpen('');
      setUserStatus('endgame');
    });

    socket.on('cleanRoom', receivedRoom => {
      setScores({ [receivedRoom.room_id]: receivedRoom.scores });
      setBalls({ [receivedRoom.room_id]: receivedRoom.ball });
      setPadles({ [receivedRoom.room_id]: receivedRoom.padles });
    });

    socket.on('roomOpen', roomId => {
      setRoomOpen(roomId);
    });

    socket.on('leaveRoom', leaveRoom => {
      if (leaveRoom) {
        setGameData(prevGameData => ({
          ...prevGameData,
          match: false,
          status: 'LEAVE',
        }));
        setVisible(false);
      }
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
      setUserStatus('endgame');
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
    socket.emit('CreateRoom', { user: userPlayer });
    setUserRoomId(socket.id);
    setUserStatus('playing');
  };

  const getInRoom = (room: RoomGame) => {
    if (
      userPlayer.id === room.player1.id ||
      room.guestId ||
      room.player2 !== null
    ) {
      setMessage('Sala ocupada');
      setMessageOpen(true);
      return;
    }
    room.player2 = userPlayer;
    socket.emit('GetInRoom', room);
    setGameData(prevGameData => ({
      ...prevGameData,
      match: true,
    }));
    let room_id = socket.id;
    gameData.rooms.forEach(room => {
      if (room.player2?.id === userPlayer.id) {
        room_id = room.room_id;
      }
    });
    setUserRoomId(room_id);
    startMatch(room_id);
    setUserStatus('playing');
  };

  const matchMakerRequest = () => {
    socket.emit('requestRoomOpen', userPlayer);
  };

  useEffect(() => {
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
    gameData.match = false;
    setUserStatus('endgame');
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

  React.useEffect(() => {
    const status_obj = {
      id: userPlayer.id,
      status: userStatus,
    };
    async function updateUserStatus() {
      await userService.updateUserStatus(status_obj);
    }
    updateUserStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userStatus]);

  return (
    <>
      {gameData.match && gameData.connected ? (
        <>
          <h1 className="title">Pong</h1>
          <h2 className="sub-title text-center">
            {players.player1} X {players.player2}
          </h2>
          <Court
            roomId={userRoomId}
            matchBall={balls[userRoomId]}
            matchPadles={padles[userRoomId]}
            matchScores={scores[userRoomId]}
            matchLevel={level[userRoomId]}
            onSendKey={sendKey}
            onSendLevel={sendLevel}
          />
          <Button
            style={{ display: 'block', margin: '40px auto 0' }}
            onClick={leaveRoom}
          >
            Sair da sala
          </Button>
        </>
      ) : (
        <>
          <h1 className="title">Lounge - {user?.name}</h1>
          <h2 className="sub-title">Jogadores</h2>
          <Divider />
          <div className="players-container">
            {gameData.players.map(player => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
          <Button className="mb-40" onClick={matchMakerRequest}>
            Encontrar Adversário
          </Button>

          <h2 className="sub-title">Salas</h2>
          <Divider />
          <Button className="mb-20" onClick={createRoom}>
            Criar sala
          </Button>
          <div className="rooms-container">
            {gameData.rooms.map(room => (
              <RoomCard key={room.room_id} room={room} getInRoom={getInRoom} />
            ))}
          </div>

          <LeaveRoomModal visible={visible} message={newMessage} />
          <Modal
            title="Aviso!"
            open={messageOpen}
            onOk={() => setMessageOpen(false)}
            onCancel={() => setMessageOpen(false)}
          >
            <p>{message}</p>
          </Modal>
        </>
      )}
    </>
  );
};
