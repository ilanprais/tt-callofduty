import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { router as routes } from "./controllers/server"

dotenv.config();

const app = express();

app.use(morgan('common'));
app.use(express.json());
app.use("/health", routes);

const start = () => {
  app.listen(process.env.PORT, () => console.log("Server started on port ", process.env.PORT));
  return app;
};

export { start };
