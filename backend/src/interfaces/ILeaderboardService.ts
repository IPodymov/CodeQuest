import { User } from '../models/User';

export type LeaderboardEntry = Pick<User, 'id' | 'name' | 'rating' | 'avatar'>;

export interface ILeaderboardService {
    getTopPlayers(limit: number): Promise<LeaderboardEntry[]>;
}
