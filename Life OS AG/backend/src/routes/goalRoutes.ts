import express from 'express';
import { createGoal, getGoals, updateGoalProgress } from '../controllers/goalController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.post('/', createGoal);
router.get('/', getGoals);
router.patch('/:id/progress', updateGoalProgress);

export default router;
