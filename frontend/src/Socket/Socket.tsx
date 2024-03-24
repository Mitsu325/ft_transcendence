import { io } from 'socket.io-client';

const URL = `https://${process.env.VERCEL_URL || ''}`;

export const socket = io(URL, {
  autoConnect: false,
});
