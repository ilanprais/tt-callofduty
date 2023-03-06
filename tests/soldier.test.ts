import request from 'supertest';
import { Express } from 'express';
import { Collection } from 'mongodb';
import lodash, { concat } from 'lodash';

import { getServer } from '../app';
import { createTestSoldier } from './data/soldier.data';
import { getSoldiersCollection } from '../db_connection';
import { Soldier } from '../schemas/soldier.zschema';

let server: Readonly<Express>;
let collection: Readonly<Collection<Soldier>>;

describe('/soldiers routes', () => {
  beforeAll(async () => {
    collection = await getSoldiersCollection();
    server = getServer();
  });

  beforeEach(async () => {
    await collection.deleteMany({});
  });

  afterAll(async () => {
    collection.deleteMany({});
  });

  describe('POST /soldiers', () => {
    test('Should return code 201 and object if all info passed correctly', async () => {
      const soldier = createTestSoldier(0);

      const res = await request(server)
        .post(`/soldiers`)
        .send(lodash.omit(soldier, 'duties'));

      expect(res.statusCode).toEqual(201);
      expect(res.body).toEqual(soldier);
    });

    test('Should return code 400 if missing a field', async () => {
      const res = await request(server)
        .post(`/soldiers`)
        .send(lodash.omit(createTestSoldier(0), ['duties', 'rank']));

      expect(res.statusCode).toEqual(400);
      expect(res.body).toContain('invalid_type');
    });

    test('Should return code 400 if a field is the wrong type', async () => {
      const res = await request(server)
        .post(`/soldiers`)
        .send({ ...createTestSoldier(0), rank: 4 });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toContain('invalid_type');
    });
  });

  describe('GET /soldiers', () => {
    test('Should return code 200 and list all soldiers', async () => {
      const soldiers = Array.from({ length: 3 }, (_, i) => {
        return createTestSoldier(i);
      });
      await collection.insertMany(structuredClone(soldiers));

      const res = await request(server).get('/soldiers');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(soldiers);
    });

    test('Should return code 200 and filter souldiers by rank', async () => {
      const soldiers = Array.from({ length: 3 }, (_, i) => {
        return createTestSoldier(i);
      });
      await collection.insertMany(structuredClone(soldiers));

      const res = await request(server).get(
        `/soldiers?rank=${soldiers[0].rank}`,
      );

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(
        soldiers.filter((soldier) => soldier.rank === soldiers[0].rank),
      );
    });

    test('Should return code 200 and return soldier by ID', async () => {
      const soldiers = Array.from({ length: 3 }, (_, i) => {
        return createTestSoldier(i);
      });
      await collection.insertMany(structuredClone(soldiers));

      const res = await request(server).get(`/soldiers/${soldiers[0].id}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(soldiers[0]);
    });

    test('Should return code 200 and return all soldiers which have a certain limitation', async () => {
      const soldiers = Array.from({ length: 3 }, (_, i) => {
        return createTestSoldier(i);
      });
      await collection.insertMany(structuredClone(soldiers));
      const res = await request(server).get(
        `/soldiers?limitations[]=${soldiers[0].limitations[0]}`,
      );
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(
        soldiers.filter((soldier) =>
          soldier.limitations.includes(soldiers[0].limitations[0]),
        ),
      );
    });

    test('Should return code 404 when id does not exist', async () => {
      const soldiers = Array.from({ length: 3 }, (_, i) => {
        return createTestSoldier(i);
      });
      await collection.insertMany(soldiers);

      const res = await request(server).get(
        `/soldiers/${concat(...soldiers.map((soldier) => soldier.id))}`,
      );

      expect(res.statusCode).toEqual(404);
    });

    test('Should return code 400 when trying to query an invalid rank', async () => {
      await collection.insertOne(createTestSoldier(0));

      const res = await request(server).get(`/soldiers?rank=invalid`);

      expect(res.statusCode).toEqual(400);
    });
  });
});
