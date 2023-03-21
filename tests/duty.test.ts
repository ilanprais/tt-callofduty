import lodash from 'lodash';
import request from 'supertest';
import { Express } from 'express';
import { Collection, ObjectId } from 'mongodb';

import { getServer } from '../app';
import { getDutiesCollection } from '../db_connection';
import { Duty, DutySchema } from '../schemas/duty.zschema';
import { createTestDuty, createTestDutyWithId } from './data/duty.data';

let server: Readonly<Express>;
let collection: Readonly<Collection<Duty>>;

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
    const duty = createTestDuty();

    const res = await request(server).post(`/duties`).send(duty);

    expect(res.statusCode).toEqual(201);
    expect(DutySchema.strip().parse(res.body)).toEqual({
      ...duty,
      soldiers: [],
    });
  });

  test('Should return code 400 if missing a field', async () => {
    const duty = createTestDuty();

    const res = await request(server)
      .post(`/soldiers`)
      .send(lodash.omit(duty, ['value']));

    expect(res.statusCode).toEqual(400);
    expect(res.body).toContain('invalid_type');
  });

  test('Should return code 400 if a field is the wrong type', async () => {
    const duty = createTestDuty();

    const res = await request(server)
      .post(`/soldiers`)
      .send({ ...duty, location: 4 });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toContain('invalid_type');
  });
});

describe('GET /duties', () => {
  test('Should return code 200 and return duties by id', async () => {
    const duties = Array.from({ length: 3 }, createTestDutyWithId);
    await collection.insertMany(duties);

    const res = await request(server).get(`/duties/${duties[0]._id}`);

    expect(res.statusCode).toEqual(200);
    expect(DutySchema.strip().parse(res.body)).toEqual(
      DutySchema.strip().parse(duties[0]),
    );
  });

  test('Should return code 200 and return all duties which have a certain constraint', async () => {
    const duties = Array.from({ length: 3 }, createTestDutyWithId);
    await collection.insertMany(duties);
    const res = await request(server).get(
      `/duties?constraints[]=${duties[0].constraints[0]}`,
    );

    const all = await request(server).get('/duties');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      all.body.filter((duty: Duty) =>
        duty.constraints.includes(duties[0].constraints[0]),
      ),
    );
  });

  test('Should return code 404 when soldier does not exist', async () => {
    const res = await request(server).get(
      `/duties/${createTestDutyWithId()._id}`,
    );

    expect(res.statusCode).toEqual(404);
  });
});

describe('DELETE /duties', () => {
  test('Should return code 200, remove the duty from db, and return the deleted duty', async () => {
    const duties = Array.from({ length: 3 }, createTestDutyWithId);
    await collection.insertMany(duties);

    const res = await request(server).delete(`/duties/${duties[0]._id}`);

    expect(res.statusCode).toEqual(200);
    expect(DutySchema.strip().parse(res.body)).toEqual(
      DutySchema.strip().parse(duties[0]),
    );
    const docs = await collection.find({}).toArray();
    expect(docs).toEqual(duties.slice(1));
  });

  test('Should return code 404 when duty does not exist', async () => {
    const res = await request(server).delete(
      `/duties/${createTestDutyWithId()._id}`,
    );

    expect(res.statusCode).toEqual(404);
  });
});

describe('PATCH /duties', () => {
  test('Should return code 200, update the duty, and return the new duty', async () => {
    const duties = Array.from({ length: 3 }, createTestDutyWithId);
    await collection.insertMany(duties);
    const newLocation = Math.random().toString(36).substring(3, 9);
    const newDoc = {
      ...duties[0],
      location: newLocation,
    };

    const res = await request(server)
      .patch(`/duties/${duties[0]._id}`)
      .send({ location: newLocation });

    expect(res.statusCode).toEqual(200);
    expect(DutySchema.strip().parse(res.body)).toEqual(
      DutySchema.strip().parse(newDoc),
    );
    const docs = await collection.find({}).toArray();
    expect(docs[0]).toEqual(newDoc);
  });

  test('Should return code 404 when duty does not exist', async () => {
    const newLocation = {
      location: Math.random().toString(36).substring(3, 9),
    };

    const res = await request(server)
      .patch(`/duties/${createTestDutyWithId()._id}`)
      .send(newLocation);

    expect(res.statusCode).toEqual(404);
  });

  test('Should return code 400 when the duty is assigned', async () => {
    const assignedDuty = {
      ...lodash.omit(createTestDutyWithId(), 'soldiers'),
      soldiers: [new ObjectId().toString()],
    };
    await collection.insertOne(assignedDuty);

    const res = await request(server)
      .patch(`/duties/${assignedDuty._id}`)
      .send({ soldiers: [] });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toContain('Cannot modify a duty which is assigned');
  });

  test('Should return code 400 when trying to update the id', async () => {
    const duty = createTestDutyWithId();
    await collection.insertOne(duty);

    const res = await request(server).patch(`/duties/${duty._id}`).send({
      _id: new ObjectId(),
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toContain('unrecognized_key');
  });

  test('Should return code 400 when updating a non-existant property', async () => {
    const duty = createTestDutyWithId();
    await collection.insertOne(duty);

    const res = await request(server).patch(`/duties/${duty._id}`).send({
      new_prop: 'prop',
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toContain('unrecognized_key');
  });

  test('Should return code 400 when the update is empty', async () => {
    const duty = createTestDutyWithId();
    await collection.insertOne(duty);

    const res = await request(server).patch(`/duties/${duty._id}`).send({});

    expect(res.statusCode).toEqual(400);
    expect(res.body).toContain('Filter has to contain at least 1 field');
  });
});
