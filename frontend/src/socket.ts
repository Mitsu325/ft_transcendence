import { io } from 'socket.io-client';

const URL = 'http://localhost:3003';

export const chatSocket = io(`${URL}/chat`, {
  autoConnect: false,
});

export const friendSocket = io(`${URL}/friend`, {
  autoConnect: false,
});
