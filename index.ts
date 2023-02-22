import { startApp } from "./app";
import { startMongoConnection } from "./mongo_connection";
 
startMongoConnection();
startApp();
