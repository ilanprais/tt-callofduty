import { z } from 'zod';
import request from 'supertest';
import dotenv from 'dotenv';
import lodash, { concat } from 'lodash';
import { Collection } from 'mongodb';
import { Express } from 'express';
import { getServer } from '../app';
import { getSoldiersCollection } from '../db_connection';
import createTestSoldiers from './soldier.data';
import { Soldier } from '../services/schemas/soldier.zschema';

dotenv.config();

let server: Readonly<Express>;
let collection: Readonly<Collection<Soldier>>;

const testSoldiers = createTestSoldiers(3);

  beforeAll(async () => {
    collection = await getSoldiersCollection();
    server = getServer();
  })

  beforeEach(async () => {
    await collection.deleteMany({});
  })

  afterAll(async () => {
    collection.deleteMany({});
  })

  describe("POST /soldiers", () => {

    test("Should return code 201 and object if all info passed correctly", async () => {
      const res = await request(server).post(`/soldiers`).send(lodash.omit(testSoldiers[0], "duties"))
      expect(res.statusCode).toEqual(201);
      expect(res.body).toEqual(testSoldiers[0]);
    });

    test("Should return code 400 if missing a field", async () => {
        const res = await request(server).post(`/soldiers`).send(lodash.omit(testSoldiers[0], ["duties", "rank"]));
        expect(res.statusCode).toEqual(400);
    });

    test('Should return code 400 if a field is the wrong type', async () => {
      const res = await request(server)
        .post(`/soldiers`)
        .send({ ...testSoldiers[0], rank: 4 });
      expect(res.statusCode).toEqual(400);
    });
  });

  describe("GET /soldiers", () => {

    beforeEach(async () => {
      await collection.insertMany(testSoldiers.map(val => ({...val})));
    })

    test("Should return code 200 and list all soldiers", async () => {
      const res = await request(server).get("/soldiers");
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(testSoldiers);
    });

    test('Should return code 200 and filter souldiers by rank', async () => {
      const res = await request(server).get(
        `/soldiers?rank=${testSoldiers[0].rank}`,
      );
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(
        testSoldiers.filter((e) => e.rank == testSoldiers[0].rank),
      );
    });

    test('Should return code 200 and return soldier by ID', async () => {
      const res = await request(server).get(`/soldiers/${testSoldiers[0].id}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(testSoldiers[0]);
    });

    test('Should return code 404 when id does not exist', async () => {
      const res = await request(server).get(
        `/soldiers/${concat(...testSoldiers.map((soldier) => soldier.id))}`,
      );
      expect(res.statusCode).toEqual(404);
    });

    test('Should return code 200 and empty list when no soldiers are found', async () => {
      const res = await request(server).get(`/soldiers?rank=invalid`);
      expect(res.statusCode).toEqual(400);
    });
  });
});