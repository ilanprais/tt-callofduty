import { ObjectId } from 'mongodb';
import { DutySchema } from '../services/schemas/duty.zschema';

const createTestDuties = (amount: number) => {
  return Array.from({ length: amount }, () => {
    return DutySchema.parse({
      _id: new ObjectId(),
      name: Math.random().toString(36).substring(3, 9),
      description: Math.random().toString(36).substring(3, 9),
      location: Math.random().toString(36).substring(3, 9),
      time: {
        start: new Date(new Date().getTime() + Math.random() * 14),
        end: new Date(new Date().getTime() + (Math.random() * 14 + 14)),
      },
      constraints: Array.from({ length: 3 }, (x, i) => {
        return `constraint ${i}`;
      }),
      soldiersRequired: Math.round(Math.random() * 10),
      value: Math.round(Math.random() * 10),
      soldiers: [],
    });
  });
};

export default createTestDuties;
