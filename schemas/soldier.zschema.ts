import { z } from 'zod';

const rankings = [
  'Turai',
  'Rabat',
  'Samal',
  'Samar',
  'Nagad',
  'Segem',
  'Segen',
  'Seren',
  'Rasan',
  'Saal',
  'Alam',
  'Taal',
  'Aluf',
  'Raal',
];

const SoldierSchema = z
  .object({
    id: z.string(),
    rank: z.enum([rankings[0], ...rankings.slice(1)]),
    name: z.string(),
    limitations: z.array(z.string()),
    duties: z.array(z.string()).optional().default([]),
  })
  .strict();

const SoldierQuerySchema = SoldierSchema.partial();

type Soldier = z.infer<typeof SoldierSchema>;
type SoldierQuery = z.infer<typeof SoldierQuerySchema>;

export { SoldierSchema, SoldierQuerySchema, Soldier, SoldierQuery, rankings };
