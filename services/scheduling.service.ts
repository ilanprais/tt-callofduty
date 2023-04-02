import { updateDuty } from './duty.service';
import { DutyId } from '../schemas/duty.zschema';
import { getDutyByID } from '../repositories/duty.repository';
import { validateDutyExists } from './validation/duty_validation';
import { addDutyToSoldiers } from '../repositories/soldier.repository';
import { findSoldiersForDuty } from '../repositories/scheduling.repository';
import {
  validateDutyIsUnscheduled,
  validateEnoughSoldiers,
} from './validation/scheduling_validation';

async function scheduleDuty(id: DutyId) {
  const duty = await getDutyByID(id);

  validateDutyExists(id, duty);
  validateDutyIsUnscheduled(id, duty);

  const assignedSoldiers = await findSoldiersForDuty(duty);

  validateEnoughSoldiers(id, duty, assignedSoldiers);

  const soldierIds = assignedSoldiers.map((soldier) => soldier['id']);

  await updateDuty(id, {
    soldiers: soldierIds,
  });

  await addDutyToSoldiers(soldierIds, id);

  const assignedDuty = await getDutyByID(id);
  return assignedDuty;
}

export default scheduleDuty;
