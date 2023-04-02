import { Duty } from '../schemas/duty.zschema';
import { getSoldiersCollection } from '../db_connection';

const findSoldiersForDuty = async (duty: Duty | null) => {
  const collection = await getSoldiersCollection();
  const constraints = duty?.constraints;
  const result = await collection
    .aggregate([
      {
        $lookup: {
          from: 'duties',
          as: 'duty_entries',
          let: { duty_ids: '$duties' },
          pipeline: [
            {
              $addFields: { _id_string: { $toString: '$_id' } },
            },
            {
              $match: { $expr: { $in: ['$_id_string', '$$duty_ids'] } },
            },
          ],
        },
      },
      {
        $addFields: {
          score: {
            $sum: '$duty_entries.value',
          },
        },
      },
      {
        $match: {
          $expr: {
            $eq: [
              { $size: { $setIntersection: [constraints, '$limitations'] } },
              0,
            ],
          },
        },
      },
      {
        $sort: {
          score: 1,
        },
      },
      { $limit: duty?.soldiersRequired },
      { $project: { id: 1, _id: 0 } },
    ])
    .toArray();
  return result;
};

export { findSoldiersForDuty };
