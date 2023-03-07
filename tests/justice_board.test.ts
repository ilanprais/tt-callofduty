import lodash from 'lodash';
import request from 'supertest';
import { Express } from 'express';
import { Collection } from 'mongodb';

import { getServer } from '../index';
import { Duty } from '../schemas/duty.zschema';
import { Soldier } from '../schemas/soldier.zschema';
import { createTestDutyWithId } from './data/duty.data';
import { createTestSoldier } from './data/soldier.data';
import { getSoldiersCollection, getDutiesCollection } from '../db_connection';

let server: Readonly<Express>;
let soldiersCollection: Readonly<Collection<Soldier>>;
let dutiesCollection: Readonly<Collection<Duty>>;

beforeAll(async () => {
  soldiersCollection = await getSoldiersCollection();
  dutiesCollection = await getDutiesCollection();
  server = getServer();
});

beforeEach(async () => {
  soldiersCollection.deleteMany({});
  dutiesCollection.deleteMany({});
});

afterEach(async () => {
  soldiersCollection.deleteMany({});
  dutiesCollection.deleteMany({});
});

describe('GET /justice-board', () => {
  test('Should return code 200 and the justice board', async () => {
    const soldiers = Array.from({ length: 3 }, (_, i) => createTestSoldier(i));
    const duties = Array.from({ length: 6 }, createTestDutyWithId);
    const assignedSoldiers = Array.from({ length: 3 }, (_, i) => {
      return {
        ...lodash.omit(soldiers[i], 'duties'),
        duties: [
          duties[i * 2]._id?.toString(),
          duties[i * 2 + 1]._id?.toString(),
        ],
      };
    });
    const assignedDuties = Array.from({ length: 6 }, (_, i) => {
      return {
        ...duties[i],
        soldiers: [soldiers[Math.floor(i / 2)].id],
      };
    });
    await soldiersCollection.insertMany(assignedSoldiers);
    await dutiesCollection.insertMany(assignedDuties);
    const res = await request(server).get(`/justice-board`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      Array.from({ length: soldiers.length }, (_, i) => {
        return {
          id: soldiers[i].id,
          score: Number(duties[i * 2].value) + Number(duties[i * 2 + 1].value),
        };
      }),
    );
  });

  test('Should return code 200 and the justice board when duties are not assigned', async () => {
    const soldiers = Array.from({ length: 3 }, (_, i) => createTestSoldier(i));
    await soldiersCollection.insertMany(soldiers);
    const res = await request(server).get(`/justice-board`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      Array.from({ length: soldiers.length }, (_, i) => {
        return {
          id: soldiers[i].id,
          score: 0,
        };
      }),
    );
  });

  test('Should return code 200 and the justice board when soldiers are not assigned', async () => {
    const duties = Array.from({ length: 6 }, createTestDutyWithId);
    await dutiesCollection.insertMany(duties);
    const res = await request(server).get(`/justice-board`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);
  });
});
