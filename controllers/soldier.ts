import express, { Response } from 'express';

import {
  createSoldier,
  findSoldierByID,
  findSoldiersByQuery,
} from '../services/soldier.service';
import {
  GetSoldierByIdSchema,
  GetSoldierByQuerySchema,
  PostSoldierSchema,
} from '../schemas/soldier.schema';
import { RequestBody } from './types';
import validateRequest from './validation';
import { Soldier, SoldierQuery } from '../schemas/soldier.zschema';
import { DocumentNotFoundError } from '../error_handling/client_errors';

const router = express.Router();

router.post(
  '/',
  validateRequest(PostSoldierSchema),
  async (req: RequestBody<Soldier>, res: Response) => {
    try {
      const { body } = req;
      const result = await createSoldier(body);
      return res.status(201).json(result);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json(error.message);
      }
    }
  },
);

router.get(
  '/:id',
  validateRequest(GetSoldierByIdSchema),
  async (req: RequestBody<Soldier>, res: Response) => {
    try {
      const { id } = req.params;
      const result = await findSoldierByID(id);
      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof DocumentNotFoundError) {
        return res.status(404).json(error.message);
      }
      if (error instanceof Error) {
        return res.status(500).json(error.message);
      }
    }
  },
);

router.get(
  '/',
  validateRequest(GetSoldierByQuerySchema),
  async (req: RequestBody<SoldierQuery>, res: Response) => {
    try {
      const { query } = req;
      const result = await findSoldiersByQuery(query);
      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json(error.message);
      }
    }
  },
);

export { router };
