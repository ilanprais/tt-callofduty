import { rankings, SoldierSchema } from '../services/schemas/soldier.zschema';
import lodash from 'lodash';

const createTestSoldiers = (amount: number) => {
  return Array.from({ length: amount }, (x, i) => {
    return SoldierSchema.parse({
      id: i.toString(),
      name: Math.random().toString(36).substring(3, 9),
      rank: lodash.sample(rankings),
      limitations: Array.from({ length: 3 }, (x, i) => {
        return `limitation ${i}`;
      }),
      duties: [],
    });
  });
};

export default createTestSoldiers;
