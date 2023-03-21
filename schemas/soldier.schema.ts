import { z } from 'zod';

import { SoldierQuerySchema, SoldierSchema } from './soldier.zschema';

const PostSoldierSchema = z.object({ body: SoldierSchema });

const GetSoldierByIdSchema = z.object({
  params: SoldierSchema.pick({ id: true }),
});

const GetSoldierByQuerySchema = z.object({ query: SoldierQuerySchema });

export { PostSoldierSchema, GetSoldierByIdSchema, GetSoldierByQuerySchema };
