import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';

type ServiceStatus = 'ok' | 'down';

export class StatusController {
    getStatus = async (req: Request, res: Response): Promise<void> => {
        const version =
            process.env.APP_VERSION ||
            process.env.npm_package_version ||
            '0.1';

        let database: ServiceStatus = 'down';
        if (AppDataSource.isInitialized) {
            try {
                await AppDataSource.query('SELECT 1');
                database = 'ok';
            } catch (error) {
                database = 'down';
            }
        }

        res.status(200).json({
            api: 'ok',
            database,
            version,
            timestamp: new Date().toISOString(),
        });
    };
}
