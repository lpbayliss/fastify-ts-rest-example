import { healthContract } from '../contracts/health.contract.js';
import { server } from './index.js';

export const healthRouter = server.router(healthContract, {
  ping: async () => {
    return {
      status: 200,
      body: 'pong',
    };
  },
});
