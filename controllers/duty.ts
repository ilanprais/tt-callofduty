import express, { Request, Response } from 'express';
import { z } from 'zod';
import { ClientError } from '../services/errors';
import { DutySchema, DutyQuerySchema } from '../services/schemas/duty.zschema';
import {
  createDuty,
  findDutyByID,
  findDutiesByQuery,
  deleteDuty,
  updateDuty,
} from '../services/duty.service';
import validateRequest from './validation';

const router = express.Router();

router.post(
  '/',
  validateRequest(z.object({ body: DutySchema })),
  async (req: Request, res: Response) => {
    try {
      const result = await createDuty(req.body);
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
      const result = await findDutyByID(req.params.id);
      return res.status(200).json(result);
    } catch (e) {
      if (e instanceof ClientError) {
        return res.status(e.code).json(e.message);
      } else if (e instanceof Error) {
        return res.status(500).json(e.message);
      }
    }
  },
);

router.get(
  '/',
  validateRequest(z.object({ query: DutyQuerySchema })),
  async (req: Request, res: Response) => {
    try {
      const result = await findDutiesByQuery(req.query);
      return res.status(200).json(result);
    } catch (e) {
      if (e instanceof Error) {
        return res.status(500).json(e.message);
      }
    }
  },
);

router.delete(
  '/:id',
  validateRequest(z.object({ params: z.object({ id: z.string() }) })),
  async (req: Request, res: Response) => {
    try {
      const result = await deleteDuty(req.params.id);
      return res.status(200).json(result);
    } catch (e) {
      if (e instanceof ClientError) {
        return res.status(e.code).json(e.message);
      } else if (e instanceof Error) {
        return res.status(500).json(e.message);
      }
    }
  },
);

router.patch(
  '/:id',
  validateRequest(
    z.object({ params: z.object({ id: z.string() }), body: DutyQuerySchema }),
  ),
  async (req: Request, res: Response) => {
    try {
      const result = await updateDuty(req.params.id, req.body);
      return res.status(200).json(result);
    } catch (e) {
      if (e instanceof ClientError) {
        return res.status(e.code).json(e.message);
      } else if (e instanceof Error) {
        return res.status(500).json(e.message);
      }
    }
  },
);

export { router };
