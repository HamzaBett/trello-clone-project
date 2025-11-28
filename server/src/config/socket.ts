import { Server } from 'socket.io';

let io: Server;

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });

    socket.on('join-board', (boardId: string) => {
      socket.join(boardId);
      console.log(`User ${socket.id} joined board ${boardId}`);
    });

    socket.on('leave-board', (boardId: string) => {
      socket.leave(boardId);
      console.log(`User ${socket.id} left board ${boardId}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};
