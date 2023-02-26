import { z } from 'zod';

const DutySchema = z
  .object({
    name: z.string(),
    description: z.string(),
    location: z.string(),
    time: z.object({
      start: z.coerce.date(),
      end: z.coerce.date(),
    }),
    constraints: z.array(z.string()),
    soldiersRequired: z.number(),
    value: z.number(),
    soldiers: z.array(z.string()).optional().default([]),
  })
  .strict();

const DutyQuerySchema = DutySchema.partial();

const DutyUpdateSchema = DutyQuerySchema.refine(
  (val) => Object.keys(val).length > 0,
  {
    message: 'Filter has to contain at least 1 field',
  },
);

const DutyIdSchema = z.string();

type Duty = z.infer<typeof DutySchema>;
type DutyQuery = z.infer<typeof DutyQuerySchema>;
type DutyUpdate = z.infer<typeof DutyUpdateSchema>;
type DutyId = z.infer<typeof DutyIdSchema>;

export {
  Duty,
  DutyQuery,
  DutyUpdate,
  DutyId,
  DutySchema,
  DutyQuerySchema,
  DutyUpdateSchema,
  DutyIdSchema,
};
