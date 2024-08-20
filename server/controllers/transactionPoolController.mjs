import { transactionPool } from '../server.mjs';

export const getTransactionPool = (req, res, next) => {
    try {
   /*     const transactions = transactionPool.transactions.map(transaction => {
            const sender = transaction.inputMap.address; 
            const recipient = Object.keys(transaction.outputMap).find(address => address !== sender); 
            const amount = transaction.outputMap[recipient];

            return {
                id: transaction.id,
                sender,
                recipient,
                amount,
            };
        });*/

        res.status(200).json({
            success: true,
            data: transactionPool.transactions,
        });
    } catch (error) {
        next(error);
    }
};
