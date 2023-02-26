import { Filter, ObjectId } from 'mongodb';
import { Duty } from '../services/schemas/duty.zschema';
import { getDutiesCollection } from '../db_connection';

const insertDuty = async (duty: Duty) => {
  const collection = await getDutiesCollection();
  const insert = await collection.insertOne(duty);
  const result = await collection.findOne({ _id: insert.insertedId });
  return result;
};

const getDutyByID = async (id: string) => {
  const collection = await getDutiesCollection();
  const result = await collection.findOne({ _id: new ObjectId(id) });
  return result;
};

const getDutiesByQuery = async (query: Filter<Duty>) => {
  const collection = await getDutiesCollection();
  const result = collection.find(query).toArray();
  return result;
};

const deleteDutyByID = async (id: string) => {
  const collection = await getDutiesCollection();
  const result = await collection.findOneAndDelete({ _id: new ObjectId(id) });
  return result;
};

const updateDutyByID = async (id: string, update: Filter<Duty>) => {
  const collection = await getDutiesCollection();
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    update,
    { returnDocument: 'after' },
  );
  return result.value;
};

export {
  insertDuty,
  getDutyByID,
  getDutiesByQuery,
  deleteDutyByID,
  updateDutyByID,
};
