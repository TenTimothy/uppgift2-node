import { Router } from 'express';
import { getTransactionPool } from '../controllers/transactionPoolController.mjs';

const router = Router();


router.get('/', getTransactionPool);

export default router;
