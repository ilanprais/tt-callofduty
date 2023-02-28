import express, { Express } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { healthRoutes, soldierRoutes } from './controllers/controllers';

dotenv.config();

const app = express();

app.use(morgan('common'));
app.use(express.json());
app.use('/health', healthRoutes);
app.use('/soldiers', soldierRoutes);

const startApp = () => {
  const listen = app.listen(process.env.PORT);
  console.log('Server started on port ', process.env.PORT);
  return listen;
};

function getServer(): Readonly<Express> {
  return app;
}

export { startApp, getServer };
