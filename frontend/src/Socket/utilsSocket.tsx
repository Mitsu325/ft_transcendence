import { socket } from '../Socket/Socket';

export const joinRoom = (roomId: string | null, userName: string) => {
  socket.emit('joinRoom', { userName: userName, roomId: roomId });

  socket.on('joinedRoom', (room: string, userName: string) => {
    console.log(`Usuário ${userName} entrou na sala ${room}`);
  });

  return () => {
    socket.off('message');
  };
};

export const sendMessage = (
  roomId: string | null,
  newMessage: string,
  userName: string,
) => {
  console.log('Socket está conectado:', socket.connected);
  if (socket && roomId) {
    socket.emit('sendMessage', {
      roomId: roomId,
      message: newMessage,
      userName: userName,
    });
  }
};

export const connect = () => {
  console.log('Connect Socket...');
  socket.connect();
};

export const disconnect = () => {
  console.log('Disconnect Socket...');
  socket.disconnect();
};
