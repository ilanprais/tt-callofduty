import { Soldier } from "../services/schemas/soldier.zschema";
import { getSoldiersCollection } from "../db_connection";
import { Filter } from "mongodb";

const insertSoldier = async (soldier: Soldier) => {
  const collection = await getSoldiersCollection();
  const insert = await collection.insertOne(soldier);
  const result = await collection.findOne({ _id: insert.insertedId });
  return result;
};

const getSoldierByID = async (id: string) => {
  const collection = await getSoldiersCollection();
  const result = await collection.findOne({ id: id });
  return result;
};

const getSoldiersByQuery = async (query: Filter<Soldier>) => {
  const collection = await getSoldiersCollection();
  const result = await collection.find(query).toArray();
  return result;
};

export { insertSoldier, getSoldierByID, getSoldiersByQuery };
