import { ZodError } from 'zod';

class EnvValidationError extends Error {
  constructor(err: ZodError) {
    super(`.env validation failed: ${err}`);
  }
}

export { EnvValidationError };
