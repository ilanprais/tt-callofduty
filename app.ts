import express, { Express } from 'express';
import morgan from 'morgan';
import logger from './logger';
import config from './config';
import { healthRoutes, soldierRoutes, dutyRoutes } from './controllers';

const app = express();

app.use(morgan('common'));
app.use(express.json());
app.use('/health', healthRoutes);
app.use('/soldiers', soldierRoutes);
app.use('/duties', dutyRoutes);

const startApp = () => {
  const listen = app.listen(config.SERVER_PORT);
  logger.info(`Server started on port ${config.SERVER_PORT}`);
  return listen;
};

function getServer(): Readonly<Express> {
  return app;
}

export { startApp, getServer };
