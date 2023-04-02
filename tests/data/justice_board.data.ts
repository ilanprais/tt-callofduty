import { createTestDutyWithId } from './duty.data';
import { createTestSoldier } from './soldier.data';

const createTestSoldiersAssignedToDuties = () => {
  const duties = Array.from({ length: 3 }, (_, i) => {
    return { ...createTestDutyWithId(), soldiers: [i.toString()] };
  });
  const soldiers = Array.from({ length: duties.length }, (_, i) => {
    return { ...createTestSoldier(i), duties: [duties[i]._id.toString()] };
  });
  return { soldiers: soldiers, duties: duties };
};

export { createTestSoldiersAssignedToDuties };
