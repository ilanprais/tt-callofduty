import express, { Response } from 'express';

import {
  DeleteDutySchema,
  GetDutyByIdSchema,
  GetDutyByQuerySchema,
  PatchDutySchema,
  PostDutySchema,
} from '../schemas/duty.schema';
import {
  createDuty,
  findDutyByID,
  findDutiesByQuery,
  deleteDuty,
  updateDuty,
} from '../services/duty.service';
import validateRequest from './validation';
import { RequestBody } from './types';
import { ClientError } from '../error_handling/client_errors';
import { Duty, DutyQuery, DutyId } from '../schemas/duty.zschema';

const router = express.Router();

router.post(
  '/',
  validateRequest(PostDutySchema),
  async (req: RequestBody<Duty>, res: Response) => {
    try {
      const { body } = req;
      const result = await createDuty(body);
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
  validateRequest(GetDutyByIdSchema),
  async (req: RequestBody<DutyId>, res: Response) => {
    try {
      const { id } = req.params;
      const result = await findDutyByID(id);
      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof ClientError) {
        return res.status(error.code).json(error.message);
      }
      if (error instanceof Error) {
        return res.status(500).json(error.message);
      }
    }
  },
);

router.get(
  '/',
  validateRequest(GetDutyByQuerySchema),
  async (req: RequestBody<DutyQuery>, res: Response) => {
    try {
      const { query } = req;
      const result = await findDutiesByQuery(query);
      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json(error.message);
      }
    }
  },
);

router.delete(
  '/:id',
  validateRequest(DeleteDutySchema),
  async (req: RequestBody<DutyId>, res: Response) => {
    try {
      const { id } = req.params;
      const result = await deleteDuty(id);
      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof ClientError) {
        return res.status(error.code).json(error.message);
      }
      if (error instanceof Error) {
        return res.status(500).json(error.message);
      }
    }
  },
);

router.patch(
  '/:id',
  validateRequest(PatchDutySchema),
  async (req: RequestBody<Duty>, res: Response) => {
    try {
      const { id } = req.params;
      const { body } = req;
      const result = await updateDuty(id, body);
      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof ClientError) {
        return res.status(error.code).json(error.message);
      }
      if (error instanceof Error) {
        return res.status(500).json(error.message);
      }
    }
  },
);

export { router };
