import { io } from 'socket.io-client';
import { apiEndPoint } from 'config';

export const socket = io(apiEndPoint);
