import io from 'socket.io-client';
import env from '../config/env';

// Create socket instance
const socket = io(env.NEXT_PUBLIC_SOCKET_URL, {
  transports: ['websocket'],
  auth: {
    token: localStorage.getItem('token') || '',
  },
});

export default socket;

// Types for socket events
export interface SocketEvents {
  // Board events
  'board-updated': (data: { boardId: string; updates: any }) => void;
  'card-created': (data: any) => void;
  'card-updated': (data: any) => void;
  'card-deleted': (data: { cardId: string }) => void;
  'list-created': (data: any) => void;
  'list-updated': (data: any) => void;
  'list-deleted': (data: { listId: string }) => void;

  // Collaboration events
  'member-joined': (data: { userId: string; username: string }) => void;
  'member-left': (data: { userId: string }) => void;
  'user-typing': (data: { userId: string; cardId: string }) => void;
  'user-stopped-typing': (data: { userId: string; cardId: string }) => void;
  'error': (error: string) => void;
}

// Types for emitting events
export interface SocketEmitEvents {
  'join-board': (boardId: string) => void;
  'leave-board': (boardId: string) => void;
  'card-moved': (data: { cardId: string; listId: string; position: number }) => void;
  'card-updated': (data: { cardId: string; updates: any }) => void;
  'list-moved': (data: { listId: string; position: number }) => void;
  'list-updated': (data: { listId: string; updates: any }) => void;
  'typing-start': (data: { cardId: string }) => void;
  'typing-end': (data: { cardId: string }) => void;
}
