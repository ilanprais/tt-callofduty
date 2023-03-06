import request from 'supertest';
import dotenv from 'dotenv';
import lodash from 'lodash';
import { Collection, ObjectId } from 'mongodb';
import { Express } from 'express-serve-static-core';
import { Duty, DutySchema } from '../services/schemas/duty.zschema';
import { getServer } from '../app';
import { getDutiesCollection } from '../db_connection';
import createTestDuties from './duty.data';

dotenv.config();

let server: Readonly<Express>;
let collection: Readonly<Collection<Duty>>;

const testDuties = createTestDuties(3);

beforeAll(async () => {
  collection = await getDutiesCollection();
  server = getServer();
});

beforeEach(async () => {
  await collection.deleteMany({});
});

afterAll(async () => {
  collection.deleteMany({});
});

describe('POST /duties', () => {
  test('Should return code 201 and object if all info passed correctly', async () => {
    const res = await request(server).post(`/duties`).send(testDuties[0]);
    expect(res.statusCode).toEqual(201);
    expect(DutySchema.parse(res.body)).toEqual({
      ...testDuties[0],
      soldiers: [],
    });
  });

  test('Should return code 400 if missing a field', async () => {
    const res = await request(server)
      .post(`/soldiers`)
      .send(lodash.omit(testDuties[0], ['value']));
    expect(res.statusCode).toEqual(400);
  });
});

describe('GET /duties', () => {
  test('Should return code 200 and return duties by id', async () => {
    await collection.insertMany(testDuties);
    const res = await request(server).get(`/duties/${testDuties[0]._id}`);
    expect(res.statusCode).toEqual(200);
    expect(DutySchema.parse(res.body)).toEqual(testDuties[0]);
  });

  test('Should return code 404 when soldier does not exist', async () => {
    const res = await request(server).get(`/duties/${testDuties[0]._id}`);
    expect(res.statusCode).toEqual(404);
  });
});

describe('DELETE /duties', () => {
  test('Should return code 200, remove the duty from db, and return the deleted duty', async () => {
    await collection.insertMany(testDuties);
    const res = await request(server).delete(`/duties/${testDuties[0]._id}`);
    expect(res.statusCode).toEqual(200);
    expect(DutySchema.parse(res.body)).toEqual(testDuties[0]);
    const docs = await collection.find({}).toArray();
    expect(docs).toEqual(testDuties.slice(1));
  });

  test('Should return code 404 when soldier does not exist', async () => {
    const res = await request(server).delete(`/duties/${testDuties[0]._id}`);
    expect(res.statusCode).toEqual(404);
  });
});

describe('PATCH /duties', () => {
  test('Should return code 200, update the duty, and return the new duty', async () => {
    await collection.insertMany(testDuties);
    const newLocation = {
      location: Math.random().toString(36).substring(3, 9),
    };
    const newDoc = {
      ...lodash.omit(testDuties[0], 'location'),
      ...newLocation,
    };
    const res = await request(server)
      .patch(`/duties/${testDuties[0]._id}`)
      .send(newLocation);
    expect(res.statusCode).toEqual(200);
    expect(DutySchema.parse(res.body)).toEqual(newDoc);
    const docs = await collection.find({}).toArray();
    expect(docs[0]).toEqual(newDoc);
  });

  test('Should return code 404 when duty does not exist', async () => {
    const res = await request(server).patch(`/duties/${testDuties[0]._id}`);
    expect(res.statusCode).toEqual(404);
  });

  test('Should return code 400 when the duty is assigned', async () => {
    const assignedDuty = DutySchema.parse({
      ...lodash.omit(testDuties[0], 'soldiers'),
      soldiers: [new ObjectId().toString()],
    });
    await collection.insertOne(assignedDuty);
    const res = await request(server).patch(`/duties/${assignedDuty._id}`);
    expect(res.statusCode).toEqual(400);
    expect(res.body).toContain('Cannot modify a duty which is assigned');
  });

  test('Should return code 400 when tyring to update the id', async () => {
    await collection.insertOne(testDuties[0]);
    const res = await request(server)
      .patch(`/duties/${testDuties[0]._id}`)
      .send({
        _id: new ObjectId(),
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toContain('Cannot modify the id of an object');
  });

  test('Should return code 200 and the original duty when updating a non-existant property', async () => {
    await collection.insertOne(testDuties[0]);
    const res = await request(server)
      .patch(`/duties/${testDuties[0]._id}`)
      .send({
        new_prop: 'prop',
      });
    expect(res.statusCode).toEqual(200);
    expect(DutySchema.parse(res.body)).toEqual(testDuties[0]);
  });

  test('Should return code 200 and the original duty when the update is empty', async () => {
    await collection.insertOne(testDuties[0]);
    const res = await request(server)
      .patch(`/duties/${testDuties[0]._id}`)
      .send({});
    expect(res.statusCode).toEqual(200);
    expect(DutySchema.parse(res.body)).toEqual(testDuties[0]);
  });
});
