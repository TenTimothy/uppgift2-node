import { it, describe, expect, beforeEach } from 'vitest';
import TransactionPool from '../models/TransactionPool.mjs';
import Transaction from '../models/Transaction.mjs';
import Wallet from '../models/Wallet.mjs';

describe('TransactionPool', () => {
    let transactionPool, transaction, wallet;

    beforeEach(() => {
        transactionPool = new TransactionPool();
        wallet = new Wallet();
        transaction = new Transaction({
            sender: wallet,
            recipient: 'recipient-address',
            amount: 50
        });

        transactionPool.addOrUpdateTransaction(transaction);
    });

    it('should add a transaction', () => {
        expect(transactionPool.transactions.length).toBe(1);
        expect(transactionPool.transactions[0]).toEqual(transaction);
    });

    it('should update a transaction', () => {
        const oldTransaction = transactionPool.transactions[0];
        const newTransaction = new Transaction({
            sender: wallet,
            recipient: 'recipient-address',
            amount: 75
        });
        newTransaction.id = oldTransaction.id; 

        transactionPool.addOrUpdateTransaction(newTransaction);

        expect(transactionPool.transactions.length).toBe(1); 
        expect(transactionPool.transactions[0]).not.toEqual(oldTransaction);
    });

    it('should clear the transactions', () => {
        transactionPool.clear();
        expect(transactionPool.transactions.length).toBe(0);
    });
});
