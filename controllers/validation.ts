import { z, ZodError } from 'zod';
import { NextFunction, query, Request, Response } from 'express';

const validateRequest =
  (schema: z.ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      req.body = parsed.body;
      req.query = parsed.query;
      req.params = parsed.params;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json(error.message);
      } else if (error instanceof Error) {
        return res.status(500).json(error);
      }
      return res.status(500).json();
    }
  };

export default validateRequest;
