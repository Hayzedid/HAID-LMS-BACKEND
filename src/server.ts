import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import { env } from './config/env';
import { setupIDEsockets } from './modules/ide/ide.socket';

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all for now, to be restricted in production config
  },
});

setupIDEsockets(io);

const startServer = () => {
  try {
    server.listen(env.PORT, () => {
      console.log(`🚀 TechLearn LMS Backend is running on http://localhost:${env.PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();
