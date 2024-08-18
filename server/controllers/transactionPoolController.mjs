import { transactionPool } from '../server.mjs'; 

export const getTransactionPool = (req, res, next) => {
    try {
        const transactions = transactionPool.transactions;
        res.status(200).json({
            success: true,
            data: transactions,
        });
    } catch (error) {
        next(error);
    }
};
