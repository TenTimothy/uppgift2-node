import express from 'express';
import { getWalletInfo, createTransaction } from '../controllers/walletController.mjs';
import { protect } from '../middlewares/authorization.mjs';

const walletRouter = express.Router();

walletRouter.use(protect);

walletRouter.route('/').get(getWalletInfo);
walletRouter.route('/transaction').post(createTransaction);

export default walletRouter;
