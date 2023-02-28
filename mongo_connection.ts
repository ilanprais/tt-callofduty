import { MongoClient, Db } from 'mongodb';

const readEnv = (env: string) => {
  const val = process.env[env];
  if (val === undefined || val === null) {
    throw 'Missing env var for ' + env;
  }
  return val;
};

const mongoDB = (function () {
  let instance: Db;

  async function createConnection() {
    const client = await MongoClient.connect(readEnv('URI_MONGO'));
    return client.db(readEnv('DB_NAME'));
  }

  return {
    getConnection: async function () {
      if (!instance) {
        instance = await createConnection();
      }
      return instance;
    },
  };
})();

export { mongoDB };
