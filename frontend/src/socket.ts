import { io } from 'socket.io-client';

const URL = process.env.VERCEL_URL || '';

export const chatSocket = io(`${URL}/chat`, {
  autoConnect: false,
});

export const friendSocket = io(`${URL}/friend`, {
  autoConnect: false,
});
