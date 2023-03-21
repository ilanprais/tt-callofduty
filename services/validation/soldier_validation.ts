import { DocumentNotFoundError } from '../../error_handling/client_errors';
import { Soldier } from '../../schemas/soldier.zschema';

const validateSoldierExists = (id: Soldier['id'], soldier: Soldier | null) => {
  if (soldier === null) {
    throw new DocumentNotFoundError(id);
  }
};

export { validateSoldierExists };
