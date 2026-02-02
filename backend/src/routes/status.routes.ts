import { Router } from 'express';
import { StatusController } from '../controllers/StatusController';

const router = Router();
const statusController = new StatusController();

router.get('/', statusController.getStatus);

export default router;
