import { getSoldiersCollection } from '../db_connection';

const getJusticeBoard = async () => {
  const collection = await getSoldiersCollection();
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
    ])
    .project({ id: 1, score: 1, _id: 0 })
    .toArray();
  return result;
};

export default getJusticeBoard;
