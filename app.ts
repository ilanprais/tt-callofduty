import { startServer } from './index';
import { disconnect, connect } from './db_connection';

const startApp = async () => {
  await connect();
  startServer();
};

const closeApp = async () => {
  await disconnect();
};

export { startApp, closeApp };
