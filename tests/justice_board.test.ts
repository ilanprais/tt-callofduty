import request from 'supertest';
import { Express } from 'express';
import { Collection } from 'mongodb';

import { getServer } from '../index';
import { Duty } from '../schemas/duty.zschema';
import { Soldier } from '../schemas/soldier.zschema';
import { createTestDutyWithId } from './data/duty.data';
import { createTestSoldier } from './data/soldier.data';
import getJusticeBoard from '../services/justice_board.service';
import * as justiceBoardService from '../services/justice_board.service';
import { getSoldiersCollection, getDutiesCollection } from '../db_connection';
import { createTestSoldiersAssignedToDuties } from './data/justice_board.data';

let server: Readonly<Express>;
let soldiersCollection: Readonly<Collection<Soldier>>;
let dutiesCollection: Readonly<Collection<Duty>>;

describe('Justice board tests', () => {
  beforeAll(async () => {
    soldiersCollection = await getSoldiersCollection();
    dutiesCollection = await getDutiesCollection();
    server = getServer();
  });

  beforeEach(async () => {
    soldiersCollection.deleteMany({});
    dutiesCollection.deleteMany({});
  });

  describe('getJusticeBoard() service', () => {
    test('Should return code 200 and the justice board', async () => {
      const { soldiers, duties } = createTestSoldiersAssignedToDuties();
      await soldiersCollection.insertMany(soldiers);
      await dutiesCollection.insertMany(duties);

      const res = await getJusticeBoard();

      expect(res).toEqual(
        Array.from({ length: soldiers.length }, (_, i) => {
          return {
            id: soldiers[i].id,
            score: Number(duties[i].value),
          };
        }),
      );
    });

    test('Should return code 200 and the justice board when duties are not assigned', async () => {
      await soldiersCollection.insertMany([createTestSoldier(0)]);
      await dutiesCollection.insertMany([createTestDutyWithId()]);

      const res = await getJusticeBoard();

      expect(res).toEqual([{ id: '0', score: 0 }]);
    });

    test('Should return code 200 and empty justice board when no soldiers exist', async () => {
      await dutiesCollection.insertMany([createTestDutyWithId()]);

      const res = await getJusticeBoard();

      expect(res).toEqual([]);
    });
  });

  describe('GET /justice-board status codes', () => {
    beforeAll(() => {
      jest.spyOn(justiceBoardService, 'default').mockReturnValue(
        new Promise((resolve) => {
          resolve([{ '0': 0 }]);
        }),
      );
    });

    test('Should return code 200 and the justice board', async () => {
      const res = await request(server).get(`/justice-board`);

      expect(res.status).toEqual(200);
    });
  });
});
