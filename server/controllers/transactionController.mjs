import { transactionPool, wallet } from '../server.mjs';

export const createTransaction = (req, res, next) => {
    try {
        const { recipient, amount } = req.body; 
        const transaction = wallet.createTransaction({ recipient, amount });

        transactionPool.addOrUpdateTransaction(transaction);

        console.log('New Transaction:', transaction);
        console.log('Current Transaction Pool:', transactionPool.transactions);

        res.status(201).json({ success: true, data: transaction });
    } catch (error) {
        next(error);
    }
};

