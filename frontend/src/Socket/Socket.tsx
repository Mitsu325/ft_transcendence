import { io } from 'socket.io-client';

const URL = 'process.env.API_URL';

export const socket = io(URL, {
  autoConnect: false,
});
