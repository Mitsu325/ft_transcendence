import { io } from 'socket.io-client';

const URL = process.env.VERCEL_URL || '';

export const socket = io(URL, {
  autoConnect: false,
});
