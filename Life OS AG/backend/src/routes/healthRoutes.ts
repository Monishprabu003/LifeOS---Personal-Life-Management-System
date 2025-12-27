import express from 'express';
import { createHealthLog, getHealthLogs } from '../controllers/healthController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.post('/', createHealthLog);
router.get('/', getHealthLogs);

export default router;
