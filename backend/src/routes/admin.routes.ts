import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';
import { AdminService } from '../services/AdminService';
import { UserRepository } from '../repositories/UserRepository';
import { ContestRepository } from '../repositories/ContestRepository';
import { ContestResultRepository } from '../repositories/ContestResultRepository';
import { requireAdminKey } from '../middleware/authMiddleware';

const router = Router();

const adminService = new AdminService(
    new UserRepository(),
    new ContestRepository(),
    new ContestResultRepository()
);
const adminController = new AdminController(adminService);

router.get('/summary', requireAdminKey, adminController.getSummary);
router.get('/users', requireAdminKey, adminController.listUsers);
router.post('/assign-role', requireAdminKey, adminController.assignRole);
router.post('/award-win', requireAdminKey, adminController.awardWin);

export default router;
