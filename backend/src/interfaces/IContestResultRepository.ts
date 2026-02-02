import { ContestResult } from '../models/ContestResult';

export interface IContestResultRepository {
    create(result: ContestResult): Promise<ContestResult>;
    findByUserId(userId: string): Promise<ContestResult[]>;
    countWinsByUserId(userId: string): Promise<number>;
    findByUserAndContest(userId: string, contestId: string): Promise<ContestResult | null>;
    clearWinnersByContest(contestId: string): Promise<void>;
    count(): Promise<number>;
    save(result: ContestResult): Promise<ContestResult>;
}
