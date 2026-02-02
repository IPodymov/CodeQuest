import { Request, Response } from 'express';
import { IProfileService } from '../interfaces/IProfileService';

export class ProfileController {
    constructor(private profileService: IProfileService) {}

    getProfile = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const profile = await this.profileService.getProfile(userId);
            res.status(200).json(profile);
        } catch (error: any) {
            if (error?.message?.includes('not found')) {
                res.status(404).json({ message: error.message });
                return;
            }
            res.status(500).json({ message: error.message ?? 'Failed to load profile' });
        }
    };

    addResult = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const profile = await this.profileService.addResult(userId, req.body);
            res.status(201).json(profile);
        } catch (error: any) {
            const message = error?.message ?? 'Failed to add result';
            if (message.includes('not found')) {
                res.status(404).json({ message });
                return;
            }
            res.status(400).json({ message });
        }
    };
}
