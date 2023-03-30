import { MongoClient } from 'mongodb';

import config from './config';
import { Duty } from './schemas/duty.zschema';
import { Soldier } from './schemas/soldier.zschema';

let client: MongoClient;

const startConnection = async () => {
  client = await MongoClient.connect(config.URI_DB);
};

const closeConnection = async () => {
  await client.close();
};

const getConnection = async () => {
  if (!client) {
    await startConnection();
  }
  return client.db(config.NAME_DB);
};

const getSoldiersCollection = async () => {
  const connection = await getConnection();
  const collection = connection.collection<Soldier>('soldiers');
  return collection;
};

const getDutiesCollection = async () => {
  const connection = await getConnection();
  const collection = connection.collection<Duty>('duties');
  return collection;
};

export {
  startConnection,
  getConnection,
  getSoldiersCollection,
  getDutiesCollection,
  closeConnection,
};
