import { z } from 'zod';
import { config } from 'dotenv';
import { logger } from './logger.service.js';

config();

const envSchema = z.object({
  PORT: z.preprocess((a) => parseInt(z.string().parse(a)), z.number()),
  NODE_ENV: z.enum(['development', 'production']).default('development'),
});

export type ConfigSchema = z.infer<typeof envSchema>;

const envConfig = await envSchema.parseAsync(process.env).catch((err) => {
  logger.error({ err }, 'Failed to parse env variables');
  process.exit(1);
});

export default {
  env: { port: envConfig.PORT },
  isDevelopment: envConfig.NODE_ENV === 'development',
};
