import { z } from 'zod';
import {
  SoldierSchema,
  Soldier,
  SoldierQuery,
} from '../services/schemas/soldier.zschema';
import {
  insertSoldier,
  getSoldierByID,
  getSoldiersByQuery,
} from '../repositories/soldier.repository';
import { DocumentNotFoundError } from '../error_handling/client_errors';

const createSoldier = async (soldier: Soldier) => {
  const DBResult = await insertSoldier(soldier);
  const result = SoldierSchema.parse(DBResult);
  return result;
};

const findSoldierByID = async (id: string) => {
  const DBResult = await getSoldierByID(id);
  if (DBResult === null) {
    throw new DocumentNotFoundError(id);
  }
  const result = SoldierSchema.parse(DBResult);
  return result;
};

const findSoldiersByQuery = async (query: SoldierQuery) => {
  const DBResult = await getSoldiersByQuery(query);
  const result = z.array(SoldierSchema).parse(DBResult);
  return result;
};

export { createSoldier, findSoldierByID, findSoldiersByQuery };
