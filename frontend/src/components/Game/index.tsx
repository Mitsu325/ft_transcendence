import * as React from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from 'hooks/useAuth';
import PlayerCard from 'components/PlayerCard';
import RoomCard from 'components/RoomCard';
import { Button } from 'antd';
// import LeaveRoomModal from 'components/Modal/LeaveRoomModal';
import Court from 'components/Court';
import './style.css';

let socket: Socket;

interface Player {
  id: string;
  name: string;
  avatar: string | null;
}

interface RoomGame {
  room_id: string;
  player1: Player;
  player2: Player | null;
}

interface GameData {
  players: Player[];
  rooms: RoomGame[];
  status: string;
  match: boolean;
  connected: boolean;
  message: string;
}

interface Match {
  matchStatus: string;
  ball: {
    x: number;
    y: number;
    width: number;
  };
  score1: number;
  score2: number;
  courtDimensions: { width: number; height: number };
}

interface MatchPadle {
  player1: { y: number; playerSpeed: number };
  player2: { y: number; playerSpeed: number };
}

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

  const [match, setMatch] = React.useState<Match>({} as Match);
  const [padle, setPadle] = React.useState<MatchPadle>({} as MatchPadle);

  socket = React.useMemo(() => {
    const newSocket = io('http://localhost:3003', {
      reconnectionDelay: 10000,
    });
    return newSocket;
  }, []);

  // const [newMessage, setNewMessage] = React.useState('');
  // const [visible, setVisible] = React.useState(false);
  // React.useEffect(() => {
  //   setVisible(true);
  //   setNewMessage(gameData.message);
  // }, [gameData.status, gameData.message]);

  React.useEffect(() => {
    socket.on('connect', () => {
      socket.emit('PlayerConnected', user);
      setGameData(prevGameData => ({
        ...prevGameData,
        connected: true,
        status: 'CONNECTED',
      }));
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
      setGameData(prevGameData => ({
        ...prevGameData,
        status: 'LEAVE',
        message: data.message,
        match: false,
      }));
    });

    socket.on('matchStarted', (receivedMacth: Match) => {
      setMatch(receivedMacth);
    });

    socket.on('movePadle', (receivedPadle: MatchPadle) => {
      setPadle(receivedPadle);
    });

    return () => {
      socket.disconnect();
      setGameData(prevGameData => ({
        ...prevGameData,
        connected: false,
        status: 'DISCONNECTED',
      }));
    };
  }, [user]);

  const createRoom = () => {
    socket.emit('CreateRoom', userPlayer);
    setGameData(prevGameData => ({
      ...prevGameData,
      match: true,
    }));
  };

  const getInRoom = (room: RoomGame) => {
    if (userPlayer.id !== room.player1.id) {
      room.player2 = userPlayer;
      socket.emit('GetInRoom', room);
      setGameData(prevGameData => ({
        ...prevGameData,
        match: true,
      }));
    } else {
      setGameData(prevGameData => ({
        ...prevGameData,
        status: `Você criou a sala ( ${room.player1.name} ), espere alguém entrar para jogar!`,
      }));
    }
    startMatch();
  };

  const leaveRoom = () => {
    socket.emit('leaveRoom', userPlayer);
  };

  const startMatch = () => {
    socket.emit('startMatch', userPlayer);
  };

  // let lastType = '';
  const sendKey = (type: string, key: string) => {
    // if (lastType === type) return;
    // lastType = type;

    const player = userPlayer.id;
    const padleObj = {
      type,
      key,
      player,
    };
    socket.emit('sendKey', padleObj);
  };

  // React.useEffect(() => {
  //   console.log('PADLE');
  //   console.log(padle);
  // }, [padle]);

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
          <h1 style={{ padding: '20px' }}>*** JOGO ***</h1>
          <div>
            <Court matchData={match} matchPadles={padle} onSendKey={sendKey} />
          </div>
          <div style={{ padding: '20px' }}>
            <Button onClick={leaveRoom}>Sair da sala</Button>
          </div>
          {/* <div>
            <LeaveRoomModal visible={visible} message={newMessage} />
          </div> */}
        </div>
      ) : (
        <div style={{ display: 'flex', width: '100%' }}>
          <div style={{ flex: '70%', marginRight: '30px' }}>
            <h1 style={{ padding: '20px' }}>*** JOGADORES ***</h1>
            <div className="players-container">
              {gameData.players.map(player => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>
            <h1 style={{ padding: '20px' }}>*** SALAS ***</h1>
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
          {/* <div style={{ flex: '30%' }}>
            <h2 style={{ padding: '20px' }}>{gameData.status}</h2>
          </div> */}
        </div>
      )}
    </>
  );
};
