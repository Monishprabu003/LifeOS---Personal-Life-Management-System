import express from 'express';
import { createHabit, getHabits, completeHabit } from '../controllers/habitController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect); // All habit routes protected

router.post('/', createHabit);
router.get('/', getHabits);
router.post('/:id/complete', completeHabit);

export default router;
