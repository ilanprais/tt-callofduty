import { faker } from '@faker-js/faker';

import { rankings } from '../../schemas/soldier.zschema';

const createTestSoldier = (id: number) => {
  return {
    id: id.toString(),
    name: faker.name.fullName(),
    rank: rankings[Math.floor(Math.random() * rankings.length)],
    limitations: Array.from({ length: 3 }, (x, i) => {
      return `limitation ${i}`;
    }),
    duties: [],
  };
};

export { createTestSoldier };
