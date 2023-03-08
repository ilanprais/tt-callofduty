import { startServer } from './index';
import { closeConnection, startConnection } from './db_connection';

import logger from './logger';
import config from './config';
import {
  healthRoutes,
  soldierRoutes,
  dutyRoutes,
  justiceBoardRoutes,
} from './controllers';

const app = express();

app.use(morgan('common'));
app.use(express.json());
app.use('/health', healthRoutes);
app.use('/soldiers', soldierRoutes);
app.use('/duties', dutyRoutes);
app.use('/justice-board', justiceBoardRoutes);

const startApp = () => {
  const listen = app.listen(config.SERVER_PORT);
  logger.info(`Server started on port ${config.SERVER_PORT}`);
  return listen;
};

const closeApp = async () => {
  await closeConnection();
};

export { startApp, closeApp };
