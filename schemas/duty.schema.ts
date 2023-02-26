import { z } from 'zod';

import {
  DutyQuerySchema,
  DutySchema,
  DutyUpdateSchema,
  DutyIdSchema,
} from './duty.zschema';

const PostDutySchema = z.object({ body: DutySchema });

const GetDutyByIdSchema = z.object({
  params: z.object({ id: DutyIdSchema }),
});

const DeleteDutySchema = GetDutyByIdSchema;

const GetDutyByQuerySchema = z.object({ query: DutyQuerySchema });

const PatchDutySchema = z.object({
  params: z.object({ id: DutyIdSchema }),
  body: DutyUpdateSchema,
});

export {
  PostDutySchema,
  GetDutyByIdSchema,
  GetDutyByQuerySchema,
  DeleteDutySchema,
  PatchDutySchema,
};
