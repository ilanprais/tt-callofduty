import { startServer } from './index';
import { closeConnection, startConnection } from './db_connection';

const startApp = async () => {
  await startConnection();
  startServer();
};

const closeApp = async () => {
  await closeConnection();
};

export { startApp, closeApp };
