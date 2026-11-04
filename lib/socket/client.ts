// lib/socket/client.ts
'use client';

import { io, Socket } from 'socket.io-client';

let socketInstance: Socket | null = null;

/**
 * Singleton Socket.io client untuk browser.
 * ponytail: Lazy singleton, zero extra state managers.
 */
export function getSocket(): Socket | null {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!socketInstance) {
    socketInstance = io({
      path: '/socket.io',
      withCredentials: true,
      autoConnect: true,
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });
  }

  return socketInstance;
}
