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
  userId: string,
  userName: string,
  createdAt: string,
) => {
  if (socket && roomId) {
    socket.emit('sendMessage', {
      roomId: roomId,
      message: newMessage,
      userId: userId,
      userName: userName,
      createdAt: createdAt,
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
