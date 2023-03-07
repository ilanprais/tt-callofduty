import request from 'supertest';
import dotenv from 'dotenv';
import lodash from 'lodash';
import { Collection, ObjectId } from 'mongodb';
import { Express } from 'express-serve-static-core';
import { Duty, DutySchema } from '../services/schemas/duty.zschema';
import { getServer } from '../app';
import { getSoldiersCollection, getDutiesCollection } from '../db_connection';
import createTestDuties from './duty.data';
import createTestSoldiers from './soldier.data';
import { Soldier, SoldierSchema } from '../services/schemas/soldier.zschema';

dotenv.config();

let server: Readonly<Express>;
let soldiersCollection: Readonly<Collection<Soldier>>;
let dutiesCollection: Readonly<Collection<Duty>>;

const testSoldiers = createTestSoldiers(3);
const testDuties = createTestDuties(6);

beforeAll(async () => {
  soldiersCollection = await getSoldiersCollection();
  dutiesCollection = await getDutiesCollection();
  server = getServer();
});

beforeEach(async () => {
  soldiersCollection.deleteMany({});
  dutiesCollection.deleteMany({});
});

afterAll(async () => {
  soldiersCollection.deleteMany({});
  dutiesCollection.deleteMany({});
});

describe('GET /justice-board', () => {
  test('Should return code 200 and the justice board', async () => {
    const assignedDuties = testDuties.map((duty: Duty, i: number) => {
      return DutySchema.parse({
        ...duty,
        soldiers: [testSoldiers[Math.floor(i / 2)].id],
      });
    });
    const assignedSoldiers = testSoldiers.map((soldier: Soldier, i: number) => {
      return SoldierSchema.parse({
        ...lodash.omit(soldier, 'duties'),
        duties: [
          testDuties[i * 2]._id?.toString(),
          testDuties[i * 2 + 1]._id?.toString(),
        ],
      });
    });
    await soldiersCollection.insertMany(assignedSoldiers);
    await dutiesCollection.insertMany(assignedDuties);
    const res = await request(server).get(`/justice-board`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      Array.from({ length: assignedSoldiers.length }, (_, i) => {
        return {
          id: assignedSoldiers[i].id,
          score:
            Number(testDuties[i * 2].value) +
            Number(testDuties[i * 2 + 1].value),
        };
      }),
    );
  });
});
