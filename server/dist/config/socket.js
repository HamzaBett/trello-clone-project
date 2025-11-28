"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
let io;
const initSocket = (server) => {
    io = new socket_io_1.Server(server, {
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
        socket.on('join-board', (boardId) => {
            socket.join(boardId);
            console.log(`User ${socket.id} joined board ${boardId}`);
        });
        socket.on('leave-board', (boardId) => {
            socket.leave(boardId);
            console.log(`User ${socket.id} left board ${boardId}`);
        });
    });
    return io;
};
exports.initSocket = initSocket;
const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
};
exports.getIO = getIO;
