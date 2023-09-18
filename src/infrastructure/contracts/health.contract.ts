import { contract } from './index.js';

export const healthContract = contract.router(
  {
    ping: {
      method: 'GET',
      path: '/ping',
      responses: {
        200: contract.type<'pong'>(),
      },
    },
  },
  {
    pathPrefix: '/api',
  },
);
