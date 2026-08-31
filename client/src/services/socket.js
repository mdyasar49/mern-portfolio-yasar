/**
 * Shared Socket.io service with robust transport fallback & error handling.
 */
import { io } from 'socket.io-client';
import { SOCKET_URL } from '../config';

const targetUrl = SOCKET_URL || (typeof window !== 'undefined' ? window.location.origin : '');

const socket = io(targetUrl, {
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  autoConnect: true,
  withCredentials: true,
});

socket.on('connect', () => {
  console.log('✅ Connected to Real-time server');
});

socket.on('connect_error', () => {
  // Silent background retry - no intrusive console spam or UI alerts
});

export default socket;
