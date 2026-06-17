import http from 'node:http';
import app from './app';
import { connectDatabase } from './config/db';
import { env } from './config/env';
import { registerSocketHandlers } from './socket';
import { Server } from 'socket.io';

const localDevOrigins = [/^http:\/\/localhost:\d+$/, /^http:\/\/127\.0\.0\.1:\d+$/];

async function bootstrap(): Promise<void> {
  await connectDatabase();

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: [env.clientUrl, ...localDevOrigins],
      credentials: true
    }
  });

  registerSocketHandlers(io);

  server.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start server', error);
  process.exitCode = 1;
});