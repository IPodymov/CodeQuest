import { Request, Response } from 'express';
import { IContestService } from '../interfaces/IContestService';

export class ContestController {
    constructor(private contestService: IContestService) {}

    getAllContests = async (req: Request, res: Response): Promise<void> => {
        try {
            const contests = await this.contestService.getAllContests();
            res.status(200).json(contests);
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    getContestById = async (req: Request, res: Response): Promise<void> => {
        try {
            const contest = await this.contestService.getContestById(req.params.id as string);
            if (!contest) {
                res.status(404).json({ message: 'Contest not found' });
                return;
            }
            res.status(200).json(contest);
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    createContest = async (req: Request, res: Response): Promise<void> => {
        try {
            const {
                title,
                platform,
                startTime,
                date,
                time,
                duration,
                url,
                description,
                difficulty,
                icon,
                imageUrl,
                background,
            } = req.body;

            let parsedStartTime: Date | null = null;
            if (startTime) {
                parsedStartTime = new Date(startTime);
            } else if (date && time) {
                parsedStartTime = new Date(`${date}T${time}`);
            }

            if (!title || !platform || !parsedStartTime || Number.isNaN(parsedStartTime.getTime())) {
                res.status(400).json({ message: 'Invalid contest payload' });
                return;
            }

            const normalizeText = (value: any) => {
                if (typeof value === 'string' && value.trim() === '') return null;
                return value ?? null;
            };

            const contest = await this.contestService.createContest({
                title,
                platform,
                startTime: parsedStartTime,
                duration: normalizeText(duration),
                url: normalizeText(url),
                description: normalizeText(description),
                difficulty: normalizeText(difficulty),
                icon: normalizeText(icon),
                imageUrl: normalizeText(imageUrl),
                background: normalizeText(background),
            });
            res.status(201).json(contest);
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    deleteContest = async (req: Request, res: Response): Promise<void> => {
        try {
            const deleted = await this.contestService.deleteContest(req.params.id as string);
            if (!deleted) {
                res.status(404).json({ message: 'Contest not found' });
                return;
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };
}
