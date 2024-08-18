// controllers/transactionPoolController.mjs

import { transactionPool } from '../server.mjs';

export const getTransactionPool = (req, res, next) => {
    try {
        const transactions = transactionPool.transactions.map(transaction => {
            const sender = transaction.inputMap.address; // Detta är avsändarens publika nyckel
            const recipient = Object.keys(transaction.outputMap).find(address => address !== sender); // Mottagaren är den andra adressen i outputMap
            const amount = transaction.outputMap[recipient]; // Beloppet som skickas till mottagaren

            return {
                id: transaction.id,
                sender,
                recipient,
                amount,
            };
        });

        res.status(200).json({
            success: true,
            data: transactions,
        });
    } catch (error) {
        next(error);
    }
};
