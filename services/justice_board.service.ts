import { getDutiesByQuery } from '../repositories/duty.repository';
import { getSoldiersByQuery } from '../repositories/soldier.repository';
import { Duty } from './schemas/duty.zschema';

async function getJusticeBoard() {
  const duties = await getDutiesByQuery({});
  const soldiers = await getSoldiersByQuery({});

  return Array.from({ length: soldiers.length }, (_, i) => {
    const score = soldiers[i].duties.reduce((sum: number, dutyId: string) => {
      return sum + Number(duties.filter((d: Duty) => d._id == dutyId)[0].value);
    }, 0);
    return { id: soldiers[i].id, score: score };
  });
}

export default getJusticeBoard;
