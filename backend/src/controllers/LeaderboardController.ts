import { Request, Response } from 'express';
import { ILeaderboardService } from '../interfaces/ILeaderboardService';

export class LeaderboardController {
    constructor(private leaderboardService: ILeaderboardService) {}

    getTopPlayers = async (req: Request, res: Response): Promise<void> => {
        try {
            const limitRaw = req.query?.limit;
            const limit = typeof limitRaw === 'string' ? Number(limitRaw) : 3;
            const players = await this.leaderboardService.getTopPlayers(limit);
            res.status(200).json({ players });
        } catch (error: any) {
            res.status(500).json({ message: error?.message ?? 'Failed to load leaderboard' });
        }
    };
}
