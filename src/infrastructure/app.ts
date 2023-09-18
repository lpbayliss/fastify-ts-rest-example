import fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { logger } from './services/logger.service.js';
import config from './services/config.service.js';
import { healthRouter } from './routers/health.router.js';
import { server } from './routers/index.js';

const app = fastify({ logger });
await app.register(cors);
await app.register(helmet, { contentSecurityPolicy: false });
app.register(server.plugin(healthRouter));

export const start = async () => {
  try {
    app.log.info(
      `Starting server in ${
        config.isDevelopment ? 'development' : 'production'
      } mode`,
    );
    await app.listen({
      port: config.env.port,
      host: config.isDevelopment ? 'localhost' : '0.0.0.0',
    });

    process.stdin.resume();

    // Graceful shutdown of server
    process.on('SIGINT', () => {
      app.log.info('Server is shutting down');
      app.close(() => {
        process.exit(0);
      });
    });

    // Graceful shutdown of server - SIGTERM required by Kubernetes
    process.on('SIGTERM', () => {
      app.log.info('API Server is shutting down');
      app.close(() => {
        process.exit(0);
      });
    });

    process.on('uncaughtException', (err) => {
      app.log.error(`Uncaught Exception: ${err}`);
    });

    process.on('unhandledRejection', (reason) => {
      app.log.error(`Unhandled Rejection: ${reason}`);
    });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
