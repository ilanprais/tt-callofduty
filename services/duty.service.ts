import { z } from 'zod';
import {
  DutySchema,
  Duty,
  DutyQuery,
  DutyQuerySchema,
} from '../services/schemas/duty.zschema';
import {
  insertDuty,
  getDutyByID,
  getDutiesByQuery,
  deleteDutyByID,
  updateDutyByID,
} from '../repositories/duty.repository';
import {
  CannotModifyAssignedDutyError,
  DocumentNotFoundError,
  CannotModifyIdError,
} from './errors';

const createDuty = async (duty: Duty) => {
  const DBResult = await insertDuty(duty);
  const result = DutySchema.parse(DBResult);
  return result;
};

async function findDutyByID(id: string) {
  const DBResult = await getDutyByID(id);
  if (DBResult == null) {
    throw new DocumentNotFoundError(id);
  }
  const result = DutySchema.parse(DBResult);
  return result;
}

async function findDutiesByQuery(query: DutyQuery) {
  const DBResult = await getDutiesByQuery(query);
  const result = z.array(DutySchema).parse(DBResult);
  return result;
}

async function deleteDuty(id: string) {
  const findDBResult = await getDutyByID(id);

  if (findDBResult == null) {
    throw new DocumentNotFoundError(id);
  }

  const findResult = DutySchema.parse(findDBResult);

  if (findResult.soldiers?.length && findResult.soldiers?.length > 0) {
    throw new CannotModifyAssignedDutyError(id);
  }

  await deleteDutyByID(id);
  return findResult;
}

async function updateDuty(id: string, query: DutyQuery) {
  const findDBResult = await getDutyByID(id);

  if (findDBResult == null) {
    throw new DocumentNotFoundError(id);
  }

  const findResult = DutySchema.parse(findDBResult);

  if (findResult.soldiers?.length && findResult.soldiers?.length > 0) {
    throw new CannotModifyAssignedDutyError(id);
  }

  const update = DutyQuerySchema.parse(query);

  if (z.object({}).strict().safeParse(update).success) {
    return findResult;
  }

  if (update._id && update._id != findResult._id) {
    throw new CannotModifyIdError(id);
  }

  const DBResult = await updateDutyByID(id, { $set: update });

  const result = DutySchema.parse(DBResult);

  return result;
}

export { createDuty, findDutyByID, findDutiesByQuery, deleteDuty, updateDuty };
