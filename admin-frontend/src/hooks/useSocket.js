import { useEffect, useRef } from 'react';
import { socketService } from '../services/socket';

export const useSocket = (eventHandlers = {}) => {
  const socketRef = useRef(null);

  useEffect(() => {
    // Connect to socket
    socketRef.current = socketService.connect();

    // Set up event handlers
    Object.entries(eventHandlers).forEach(([event, handler]) => {
      socketRef.current.on(event, handler);
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        Object.entries(eventHandlers).forEach(([event, handler]) => {
          socketRef.current.off(event, handler);
        });
        socketService.disconnect();
      }
    };
  }, [eventHandlers]);

  return socketRef.current;
};