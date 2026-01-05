import express from 'express';
import { updateProfile, updateSettings } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.put('/profile', protect, updateProfile);
router.put('/settings', protect, updateSettings);

export default router;
