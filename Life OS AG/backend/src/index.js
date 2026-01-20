import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import http from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5001;

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    },
});

console.log('Backend process starting...');

// Socket.io integration placeholder
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const startServer = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await connectDB();
        console.log('MongoDB connection call finished.');
        server.listen(PORT, () => {
            console.log(`LifeOS Kernel running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
