import { Server } from 'socket.io';
import http from 'http';

class SocketServer {
  private io!: Server;

  init(server: http.Server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_URL,
        credentials: true,
      },
    });

    this.io.use((socket, next) => {
      // Authentication middleware
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }
      // Verify token and set userId
      // This is a simplified version - in production, verify JWT properly
      try {
        // const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        // socket.userId = (decoded as any).userId;
        socket.userId = 'test-user-id'; // Temporary for development
        next();
      } catch (error) {
        next(new Error('Authentication error'));
      }
    });

    this.io.on('connection', (socket) => {
      console.log('User connected:', socket.id);

      // Join board room
      socket.on('join-board', (boardId: string) => {
        socket.join(boardId);
        console.log(`User ${socket.id} joined board ${boardId}`);
      });

      // Leave board room
      socket.on('leave-board', (boardId: string) => {
        socket.leave(boardId);
        console.log(`User ${socket.id} left board ${boardId}`);
      });

      // Handle card moved event
      socket.on('card-moved', (data: { cardId: string; listId: string; position: number }) => {
        // Broadcast to all users in the board room
        this.io.to(data.listId).emit('card-updated', data);
      });

      // Handle card updated event
      socket.on('card-updated', (data: { cardId: string; updates: any }) => {
        // Broadcast to all users in the board room
        this.io.to(data.cardId).emit('card-updated', data);
      });

      // Handle list moved event
      socket.on('list-moved', (data: { listId: string; position: number }) => {
        // Broadcast to all users in the board room
        this.io.to(data.listId).emit('list-updated', data);
      });

      // Handle list updated event
      socket.on('list-updated', (data: { listId: string; updates: any }) => {
        // Broadcast to all users in the board room
        this.io.to(data.listId).emit('list-updated', data);
      });

      // Handle typing start
      socket.on('typing-start', (data: { cardId: string }) => {
        // Broadcast to other users in the same board
        socket.broadcast.to(data.cardId).emit('user-typing', {
          userId: socket.userId,
          cardId: data.cardId,
        });
      });

      // Handle typing end
      socket.on('typing-end', (data: { cardId: string }) => {
        // Broadcast to other users in the same board
        socket.broadcast.to(data.cardId).emit('user-stopped-typing', {
          userId: socket.userId,
          cardId: data.cardId,
        });
      });

      // Handle disconnect
      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });
  }

  getIO() {
    return this.io;
  }
}

export default new SocketServer();
