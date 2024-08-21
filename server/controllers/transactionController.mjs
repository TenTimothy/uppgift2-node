import { transactionPool, wallet, blockchain } from '../server.mjs';

export const createTransaction = (req, res, next) => {
    try {
        const { recipient, amount } = req.body; 
        let transaction = transactionPool.transactionExist({address: wallet.publicKey})
       
        if(transaction){
            transaction.update({ sender: wallet, recipient, amount })
            console.log('A');
        } else {
            transaction = wallet.createTransaction({ recipient, amount, chain: blockchain.chain });
            console.log('B');
        }   

        transactionPool.addTransactions(transaction);
        res.status(201).json({ success: true, data: transaction });
    } catch (error) {
        next(error);
    }
};

