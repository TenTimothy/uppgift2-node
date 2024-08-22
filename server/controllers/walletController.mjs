import Wallet from '../models/Wallet.mjs';
import { blockchain, transactionPool, wallet } from '../server.mjs';  


export const getWalletInfo = (req, res, next) => {
    try {
        const balance = Wallet.calculateBalance({
            chain: blockchain.chain,
            address: wallet.publicKey,
        });

        res.status(200).json({
            success: true,
            data: {
                publicKey: wallet.publicKey,
                balance,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const createTransaction = (req, res, next) => {
    const { recipient, amount } = req.body;

    try {
        const transaction = wallet.createTransaction({
            recipient,
            amount,
            chain: blockchain.chain,
        });

        transactionPool.addTransactions(transaction);

        res.status(201).json({
            success: true,
            data: transaction,
        });
    } catch (error) {
        next(error);
    }
};
