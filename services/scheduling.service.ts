import { getDutyByID } from '../repositories/duty.repository';
import { getSoldiersByQuery } from '../repositories/soldier.repository';
import { updateDuty } from './duty.service';
import getJusticeBoard from './justice_board.service';
import { Duty } from './schemas/duty.zschema';

async function scheduleDuty(id: string) {
  const duty = await getDutyByID(id);
  const soldiers = await getSoldiersByQuery({});
  const justiceBoard = await getJusticeBoard();

  if (!duty?.soldiers || duty?.soldiers.length === 0) {
    // throw custom
  }

  const assignedSoldiers = Object.keys(
    justiceBoard.sort((field1, field2) => field1.score - field2.score),
  ).slice(0, Number(duty?.soldiersRequired));

  await updateDuty(id, {
    soldiers: assignedSoldiers,
  });
}

export default scheduleDuty;
