import { transactionPool } from '../server.mjs';

export const getTransactionPool = (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            data: transactionPool.transactions,
        });
    } catch (error) {
        next(error);
    }
};
