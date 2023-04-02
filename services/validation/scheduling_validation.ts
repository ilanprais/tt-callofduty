import {
  CannotScheduleScheduledDutyError,
  InsufficientSoldiersForSchedulingDutyError,
} from '../../error_handling/scheduling_errors';
import { Soldier } from '../../schemas/soldier.zschema';
import { Duty, DutyId } from '../../schemas/duty.zschema';
import { Document } from 'mongodb';

const validateDutyIsUnscheduled = (id: DutyId, duty: Duty | null) => {
  if (
    duty &&
    duty.soldiers?.length !== undefined &&
    duty.soldiers?.length > 0
  ) {
    throw new CannotScheduleScheduledDutyError(id.toString());
  }
};

const validateEnoughSoldiers = (
  id: DutyId,
  duty: Duty | null,
  assignedSoldiers: Document[],
) => {
  if (assignedSoldiers.length < Number(duty?.soldiersRequired)) {
    throw new InsufficientSoldiersForSchedulingDutyError(id);
  }
};

export { validateDutyIsUnscheduled, validateEnoughSoldiers };
