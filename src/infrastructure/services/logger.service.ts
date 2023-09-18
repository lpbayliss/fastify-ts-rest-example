import { defaultImport } from 'default-import';
import pino from 'pino';
import pretty from 'pino-pretty';
import config from './config.service.js';

export const logger = defaultImport(pino)(
  config.isDevelopment ? defaultImport(pretty)({ sync: true }) : undefined,
);
