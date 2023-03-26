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

describe('PUT duties/:id/schedule', () => {
  test('Should return code 200 and assign the soldier to the duty', async () => {
    const soldier = createTestSoldier(0);
    const duty = createTestDutyWithId();
    await soldiersCollection.insertOne(soldier);
    await dutiesCollection.insertOne(duty);

    const res = await request(server).put(`duties/${duty._id}/schedule`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ ...duty, soldiers: [duty._id] });
    const assignedSoldier = await request(server).get(`soldiers/${soldier.id}`);
    expect(assignedSoldier.body.duties).toEqual([duty._id]);
  });
});
