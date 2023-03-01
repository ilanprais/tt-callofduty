import { z } from 'zod';
import dotenv from 'dotenv';
import { EnvValidationError } from './error_handling/server_errors';

dotenv.config();

const ConfigSchema = z.object({
  SERVER_PORT: z.string().refine((val) => Number(val)),
  URI_DB: z.string(),
  NAME_DB: z.string(),
  LOG_LEVEL: z.string(),
});

const validateConfiguration = () => {
  const config = ConfigSchema.safeParse(process.env);
  if (!config.success) {
    throw new EnvValidationError(config.error);
  }
  return config.data;
};

const config = validateConfiguration();

export default config;
