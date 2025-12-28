import express from 'express';
import { createEvent, getEvents, getLifeStatus, deleteEvent } from '../controllers/lifeEventController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.post('/event', createEvent);
router.get('/events', getEvents);
router.delete('/events/:id', deleteEvent);
router.get('/status', getLifeStatus);

export default router;
