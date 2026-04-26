/**
 * Shared Socket.io service.
 * Ensures only one connection is maintained across the application.
 */
import { io } from 'socket.io-client';
import { SOCKET_URL } from '../config';

const socket = io(SOCKET_URL, {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  autoConnect: true,
});

// Optional: Add global event listeners here if needed
socket.on('connect', () => {
  console.log('✅ Connected to Real-time server');
});

socket.on('connect_error', (error) => {
  console.warn('❌ Socket connection error:', error.message);
});

export default socket;
