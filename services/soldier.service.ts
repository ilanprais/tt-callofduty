import {
  insertSoldier,
  getSoldierByID,
  getSoldiersByQuery,
} from '../repositories/soldier.repository';
import { Soldier, SoldierQuery } from '../schemas/soldier.zschema';
import { validateSoldierExists } from './validation/soldier_validation';

const createSoldier = async (soldier: Soldier) => {
  const result = await insertSoldier({ ...soldier });
  return result;
};

const findSoldierByID = async (id: Soldier['id']) => {
  const result = await getSoldierByID(id);

  validateSoldierExists(id, result);

  return result;
};

const findSoldiersByQuery = async (query: SoldierQuery) => {
  const result = await getSoldiersByQuery(query);
  return result;
};

export { createSoldier, findSoldierByID, findSoldiersByQuery };
