import {
  CannotModifyAssignedDutyError,
  DocumentNotFoundError,
} from '../../error_handling/client_errors';
import { Duty, DutyId } from '../../schemas/duty.zschema';

const validateDutyIsModifiable = (id: DutyId, duty: Duty | null) => {
  if (
    duty &&
    duty.soldiers?.length !== undefined &&
    duty.soldiers?.length > 0
  ) {
    throw new CannotModifyAssignedDutyError(id.toString());
  }
};

const validateDutyExists = (id: DutyId, duty: Duty | null) => {
  if (duty === null) {
    throw new DocumentNotFoundError(id.toString());
  }
};

export { validateDutyExists, validateDutyIsModifiable };
