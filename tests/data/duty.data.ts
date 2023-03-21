import { faker } from '@faker-js/faker';

import { ObjectId } from 'mongodb';

const createTestDuty = () => {
  return {
    name: faker.name.fullName(),
    description: faker.lorem.sentence(),
    location: faker.address.city(),
    time: {
      start: faker.date.future(1),
      end: faker.date.future(1),
    },
    constraints: Array.from({ length: 3 }, (x, i) => {
      return `constraint ${i}`;
    }),
    soldiersRequired: Math.round(Math.random() * 10),
    value: Math.round(Math.random() * 10),
    soldiers: [],
  };
};

const createTestDutyWithId = () => {
  return {
    _id: new ObjectId(),
    ...createTestDuty(),
  };
};

export { createTestDuty, createTestDutyWithId };
