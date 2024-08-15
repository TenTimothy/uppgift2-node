import { Router } from 'express';
import { createTransaction } from '../controllers/transactionController.mjs';

const router = Router();

router.post('/transactions', createTransaction);

export default router;
