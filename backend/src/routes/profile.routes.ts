import { Router } from 'express';
import { ProfileController } from '../controllers/ProfileController';
import { ProfileService } from '../services/ProfileService';
import { UserRepository } from '../repositories/UserRepository';
import { ContestRepository } from '../repositories/ContestRepository';
import { ContestResultRepository } from '../repositories/ContestResultRepository';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

const profileService = new ProfileService(
    new UserRepository(),
    new ContestRepository(),
    new ContestResultRepository()
);
const profileController = new ProfileController(profileService);

router.get('/', authenticateToken, profileController.getProfile);
router.post('/results', authenticateToken, profileController.addResult);

export default router;
