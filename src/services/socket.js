import io from 'socket.io-client';
import { SOCKET_URL } from '../config/api';

class SocketService {
  socket = null;

  connect(userId) {
    this.socket = io(SOCKET_URL, {
      query: { userId },
      transports: ['websocket']
    });

    this.socket.on('connect', () => console.log('Socket connected'));
    this.socket.on('disconnect', () => console.log('Socket disconnected'));

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit(event, data) {
    this.socket?.emit(event, data);
  }

  on(event, callback) {
    this.socket?.on(event, callback);
  }

  off(event) {
    this.socket?.off(event);
  }
}

export default new SocketService();
