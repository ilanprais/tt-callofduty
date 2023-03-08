import { getDutiesByQuery } from '../repositories/duty.repository';
import { getSoldiersByQuery } from '../repositories/soldier.repository';
import { Soldier } from '../schemas/soldier.zschema';

async function getJusticeBoard() {
  const duties = await getDutiesByQuery({});
  const soldiers = await getSoldiersByQuery({});

  return soldiers.map((soldier: Soldier) => {
    const score = soldier.duties.reduce((sum: number, dutyId: string) => {
      const relevantDuties = duties.filter((d) => d._id.toString() == dutyId);
      return relevantDuties.length > 0
        ? sum + Number(relevantDuties[0].value)
        : sum;
    }, 0);
    return { id: soldier.id, score: score };
  });
}

export default getJusticeBoard;
