import { Router } from 'express';
import { LeaderboardController } from '../controllers/LeaderboardController';
import { LeaderboardService } from '../services/LeaderboardService';
import { UserRepository } from '../repositories/UserRepository';

const router = Router();

const leaderboardService = new LeaderboardService(new UserRepository());
const leaderboardController = new LeaderboardController(leaderboardService);

router.get('/', leaderboardController.getTopPlayers);

export default router;
