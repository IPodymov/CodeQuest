import { AppDataSource } from '../data-source';
import { ContestResult } from '../models/ContestResult';
import { IContestResultRepository } from '../interfaces/IContestResultRepository';

export class ContestResultRepository implements IContestResultRepository {
    private repository = AppDataSource.getRepository(ContestResult);

    async create(result: ContestResult): Promise<ContestResult> {
        const entity = this.repository.create(result);
        return this.repository.save(entity);
    }

    async findByUserId(userId: string): Promise<ContestResult[]> {
        return this.repository.find({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' }
        });
    }

    async countWinsByUserId(userId: string): Promise<number> {
        return this.repository.count({
            where: { user: { id: userId }, isWinner: true }
        });
    }

    async findByUserAndContest(userId: string, contestId: string): Promise<ContestResult | null> {
        return this.repository.findOne({
            where: { user: { id: userId }, contest: { id: contestId } }
        });
    }

    async clearWinnersByContest(contestId: string): Promise<void> {
        await this.repository
            .createQueryBuilder()
            .update(ContestResult)
            .set({ isWinner: false })
            .where('contestId = :contestId', { contestId })
            .andWhere('isWinner = :isWinner', { isWinner: true })
            .execute();
    }

    async count(): Promise<number> {
        return this.repository.count();
    }

    async save(result: ContestResult): Promise<ContestResult> {
        return this.repository.save(result);
    }
}
