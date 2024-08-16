import { transactionPool } from '../server.mjs';
import Wallet from '../models/Wallet.mjs';

export const createTransaction = (req, res, next) => {
    try {
        const { recipient, amount } = req.body;
        const sender = new Wallet(); 
        const transaction = sender.createTransaction({ recipient, amount });

        transactionPool.addOrUpdateTransaction(transaction);

        console.log('New Transaction:', transaction);
        console.log('Current Transaction Pool:', transactionPool.transactions);

        res.status(201).json({ success: true, data: transaction });
    } catch (error) {
        next(error);
    }
};

