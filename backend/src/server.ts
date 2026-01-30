import "reflect-metadata";
import app from './app';
import Logger from './utils/logger';
import {AppDataSource} from "./data-source";

const PORT = process.env.PORT || 3000;
const SECONDARY_PORT = 8080;

AppDataSource.initialize()
    .then(() => {
        Logger.info("Data Source has been initialized!");
        app.listen(PORT, () => {
            Logger.info(`Server is running on port ${PORT}`);
        });

        // Listen on secondary port as well
        if (Number(PORT) !== SECONDARY_PORT) {
             app.listen(SECONDARY_PORT, () => {
                 Logger.info(`Server is running on secondary port ${SECONDARY_PORT}`);
             });
        }
    })
    .catch((err) => {
        Logger.error("Error during Data Source initialization:", err);
    });
