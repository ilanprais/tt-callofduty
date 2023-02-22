import { z, ZodError } from 'zod';
import { NextFunction, Request, Response } from 'express';

const validateRequest =
  (schema: z.ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (e) {
      if (e instanceof ZodError) {
        return res.status(400).json(e.message);
      } else if (e instanceof Error) {
        return res.status(500).json(e);
      }
      return res.status(500).json();
    }
  };

export default validateRequest;
