import { z } from 'zod';
import { ObjectId } from 'mongodb';

const IdSchema = z.preprocess(
  (id: any) => new ObjectId(id),
  z.custom<ObjectId>().or(z.string()),
);

const DutySchema = z.object({
  _id: IdSchema.optional(),
  name: z.string(),
  description: z.string(),
  location: z.string(),
  time: z.object({
    start: z.coerce.date(),
    end: z.coerce.date(),
  }),
  constraints: z.array(z.string()),
  soldiersRequired: z.number().or(z.string()),
  value: z.number().or(z.string()),
  soldiers: z.array(z.string()).optional(),
});

const DutyQuerySchema = DutySchema.partial();

type Duty = z.infer<typeof DutySchema>;
type DutyQuery = z.infer<typeof DutyQuerySchema>;

export { Duty, DutyQuery, IdSchema, DutySchema, DutyQuerySchema };
