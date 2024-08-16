import { Router } from 'express';
import { getTransactionPool } from '../controllers/transactionPoolController.mjs';

const router = Router();

// GET /api/v1/transaction-pool - Hämta hela transaktionspoolen
router.get('/', getTransactionPool);

export default router;
