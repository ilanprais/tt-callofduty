import { updateDuty } from './duty.service';
import { updateSoldier } from './soldier.service';
import getJusticeBoard from './justice_board.service';
import { getDutyByID } from '../repositories/duty.repository';
import { getSoldiersByQuery } from '../repositories/soldier.repository';
import {
  CannotScheduleScheduledDutyError,
  InsufficientSoldiersForSchedulingDutyError,
} from '../error_handling/scheduling_errors';

async function scheduleDuty(id: string) {
  const duty = await getDutyByID(id);
  const soldiers = await getSoldiersByQuery({});
  const justiceBoard = await getJusticeBoard();

  if (duty?.soldiers && duty?.soldiers.length > 0) {
    throw new CannotScheduleScheduledDutyError(id);
  }

  const suitableSoldierIds = soldiers
    .filter(
      (soldier) =>
        soldier.limitations.filter((limitation) =>
          duty?.constraints.includes(limitation),
        ).length == 0,
    )
    .map((soldier) => soldier.id);

  const assignedSoldierIds = justiceBoard
    .filter((field) => suitableSoldierIds.includes(field.id))
    .sort((field1, field2) => field1.score - field2.score)
    .map((field) => field.id)
    .slice(0, Number(duty?.soldiersRequired));

  if (suitableSoldierIds.length < Number(duty?.soldiersRequired)) {
    throw new InsufficientSoldiersForSchedulingDutyError(id);
  }

  await updateDuty(id, {
    soldiers: assignedSoldierIds,
  });

  assignedSoldierIds.forEach(async (soldierId) => {
    const originalDuties = soldiers.find(
      (soldier) => soldier.id == soldierId,
    )?.duties;
    await updateSoldier(soldierId, {
      duties: [...(originalDuties ? originalDuties : []), id],
    });
  });

  const assignedDuty = await getDutyByID(id);
  return assignedDuty;
}

export default scheduleDuty;
