import express from 'express';
import { createHealthLog, getHealthLogs, deleteHealthLog } from '../controllers/healthController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', createHealthLog);
router.get('/', getHealthLogs);
router.delete('/:id', deleteHealthLog);

export default router;
