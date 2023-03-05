import express, { Express } from 'express';
import morgan from 'morgan';
import logger from './logger';
import config from './config';
import { healthRoutes, soldierRoutes } from './controllers';

const app = express();

app.use(morgan('common'));
app.use(express.json());
app.use('/health', healthRoutes);
app.use('/soldiers', soldierRoutes);

const startApp = () => {
  const listen = app.listen(config.SERVER_PORT);
  logger.info(`Server started on port ${config.SERVER_PORT}`);
  return listen;
};

function getServer(): Readonly<Express> {
  return app;
}

export { startApp, getServer };
