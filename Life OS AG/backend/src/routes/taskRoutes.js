import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createTask, toggleTask, getTasks } from '../controllers/taskController.js';

const router = express.Router();

router.route('/')
    .get(protect, getTasks)
    .post(protect, createTask);

router.route('/:id/toggle')
    .post(protect, toggleTask);

export default router;
