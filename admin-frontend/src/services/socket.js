import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    const SOCKET_URL = import.meta.env.VITE_API_URL || 'https://restaurant-qr-billing.onrender.com';
    this.socket = io(SOCKET_URL);

    this.socket.on('connect', () => {
      console.log('Connected to server');
      // Join admin room for order updates
      this.socket.emit('join_admin_room');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }
}

export const socketService = new SocketService();