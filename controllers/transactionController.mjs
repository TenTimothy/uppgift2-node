import Wallet from '../models/Wallet.mjs';
import Transaction from '../models/Transaction.mjs';

export const createTransaction = (req, res, next) => {
    try {
        const { recipient, amount } = req.body;
        const sender = new Wallet(); 
        const transaction = sender.createTransaction({ recipient, amount });

        res.status(201).json({ success: true, data: transaction });
    } catch (error) {
        next(error);
    }
};

