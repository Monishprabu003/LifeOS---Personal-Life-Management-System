import express from 'express';
import { createRelationship, getRelationships, logInteraction, deleteRelationship } from '../controllers/relationshipController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', createRelationship);
router.get('/', getRelationships);
router.post('/:id/interact', logInteraction);
router.delete('/:id', deleteRelationship);

export default router;
