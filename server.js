import { createServer } from 'node:http';
import next from 'next';
import { Server as SocketIOServer } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || '0.0.0.0';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

async function startServer() {
  try {
    await app.prepare();

    const server = createServer(async (req, res) => {
      try {
        await handle(req, res);
      } catch (err) {
        console.error('Error handling HTTP request:', err);
        res.statusCode = 500;
        res.end('internal server error');
      }
    });

    const io = new SocketIOServer(server, {
      path: '/socket.io',
      cors: {
        origin: true,
        credentials: true,
      },
    });

    // Store globally so Server Actions & Service layer can emit events
    globalThis.__io = io;

    io.on('connection', (socket) => {
      // Room subscriptions
      socket.on('join:reports', () => {
        socket.join('reports');
      });

      socket.on('leave:reports', () => {
        socket.leave('reports');
      });

      socket.on('join:user', (userId) => {
        if (userId) {
          socket.join(`user:${userId}`);
        }
      });
    });

    server.listen(port, () => {
      console.log(`> WebPoint LMS with Socket.io running on http://${hostname}:${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
