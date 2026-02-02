import { Router } from 'express';
import contestRoutes from './contest.routes';
import authRoutes from './auth.routes';
import statusRoutes from './status.routes';
import profileRoutes from './profile.routes';
import adminRoutes from './admin.routes';
import leaderboardRoutes from './leaderboard.routes';

const router = Router();

router.use('/contests', contestRoutes);
router.use('/auth', authRoutes);
router.use('/status', statusRoutes);
router.use('/profile', profileRoutes);
router.use('/admin', adminRoutes);
router.use('/leaderboard', leaderboardRoutes);

export default router;
