import {
  validateDutyExists,
  validateDutyIsModifiable,
} from './validation/duty_validation';
import { Duty, DutyQuery, DutyUpdate, DutyId } from '../schemas/duty.zschema';
import {
  insertDuty,
  getDutyByID,
  getDutiesByQuery,
  deleteDutyByID,
  updateDutyByID,
} from '../repositories/duty.repository';

const createDuty = async (duty: Duty) => {
  const result = await insertDuty({
    ...duty,
  });
  return result;
};

const findDutyByID = async (id: DutyId) => {
  const result = await getDutyByID(id);

  validateDutyExists(id, result);

  return result;
};

const findDutiesByQuery = async (query: DutyQuery) => {
  const result = await getDutiesByQuery(query);
  return result;
};

const deleteDuty = async (id: DutyId) => {
  const result = await getDutyByID(id);

  validateDutyExists(id, result);
  validateDutyIsModifiable(id, result);

  await deleteDutyByID(id);
  return result;
};

const updateDuty = async (id: DutyId, update: DutyUpdate) => {
  const findResult = await getDutyByID(id);

  validateDutyExists(id, findResult);
  validateDutyIsModifiable(id, findResult);

  const result = await updateDutyByID(id, update);

  return result;
};

export { createDuty, findDutyByID, findDutiesByQuery, deleteDuty, updateDuty };
