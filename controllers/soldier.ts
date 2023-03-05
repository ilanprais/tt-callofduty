import express, { Request, Response } from 'express';
import { z } from 'zod';
import { DocumentNotFoundError } from '../error_handling/client_errors';
import {
  SoldierSchema,
  SoldierQuerySchema,
} from '../services/schemas/soldier.zschema';
import validateRequest from './validation';
import {
  createSoldier,
  findSoldierByID,
  findSoldiersByQuery,
} from '../services/soldier.service';

const router = express.Router();

router.post(
  '/',
  validateRequest(z.object({ body: SoldierSchema })),
  async (req: Request, res: Response) => {
    try {
      const result = await createSoldier(req.body);
      return res.status(201).json(result);
    } catch (e) {
      if (e instanceof Error) {
        return res.status(500).json(e.message);
      }
    }
  },
);

router.get(
  '/:id',
  validateRequest(z.object({ params: z.object({ id: z.string() }) })),
  async (req: Request, res: Response) => {
    try {
      const result = await findSoldierByID(req.params.id);
      return res.status(200).json(result);
    } catch (e) {
      if (e instanceof DocumentNotFoundError) {
        return res.status(404).json(e.message);
      } else if (e instanceof Error) {
        return res.status(500).json(e.message);
      }
    }
  },
);

router.get(
  '/',
  validateRequest(z.object({ query: SoldierQuerySchema })),
  async (req: Request, res: Response) => {
    try {
      const result = await findSoldiersByQuery(req.query);
      return res.status(200).json(result);
    } catch (e) {
      if (e instanceof Error) {
        return res.status(500).json(e.message);
      }
    }
  },
);

export { router };
