import { MongoClient, Db } from 'mongodb';
import config from './config';
import { Soldier } from './services/schemas/soldier.zschema';

let connection: Db;

const connect = async () => {
  const client = await MongoClient.connect(config.URI_DB);
  connection = client.db(config.NAME_DB);
};

const getConnection = async () => {
  if (!connection) {
    await connect();
  }
  return connection;
};

const getSoldiersCollection = async () => {
  const connection = await getConnection();
  const collection = connection.collection<Soldier>('soldiers');
  return collection;
};

export { getSoldiersCollection };
