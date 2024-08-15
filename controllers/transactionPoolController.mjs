import { transactionPool } from '../server.mjs'; // Säkerställ att detta är samma instans

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
