import { Filter } from 'mongodb';

import { Soldier } from '../schemas/soldier.zschema';
import { getSoldiersCollection } from '../db_connection';

const defaultProjection = { projection: { _id: false } };

const insertSoldier = async (soldier: Soldier) => {
  const collection = await getSoldiersCollection();
  const insert = await collection.insertOne(soldier);
  const result = await collection.findOne(
    { _id: insert.insertedId },
    defaultProjection,
  );
  return result;
};

const getSoldierByID = async (id: Soldier['id']) => {
  const collection = await getSoldiersCollection();
  const result = await collection.findOne({ id: id }, defaultProjection);
  return result;
};

const getSoldiersByQuery = async (query: Filter<Soldier>) => {
  const collection = await getSoldiersCollection();
  const result = await collection
    .find(
      {
        ...query,
        ...(query.limitations
          ? { limitations: { $all: Object.values(query.limitations) } }
          : {}),
        ...(query.duties
          ? { duties: { $all: Object.values(query.duties) } }
          : {}),
      },
      defaultProjection,
    )
    .toArray();
  return result;
};

const updateSoldierByID = async (id: string, update: UpdateFilter<Soldier>) => {
  const result = await collection.findOneAndUpdate({ id: id }, update, {
    returnDocument: 'after',
    projection: { _id: false },
  });
  return result.value;
};

export { insertSoldier, getSoldierByID, getSoldiersByQuery, updateSoldierByID };
