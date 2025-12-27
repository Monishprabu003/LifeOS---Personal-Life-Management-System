import express from 'express';
import { createTransaction, getTransactions } from '../controllers/financeController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.post('/', createTransaction);
router.get('/', getTransactions);

export default router;
