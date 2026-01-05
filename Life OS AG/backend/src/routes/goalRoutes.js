import express from 'express';
import { createGoal, getGoals, updateGoalProgress, deleteGoal } from '../controllers/goalController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', createGoal);
router.get('/', getGoals);
router.patch('/:id/progress', updateGoalProgress);
router.delete('/:id', deleteGoal);

export default router;
