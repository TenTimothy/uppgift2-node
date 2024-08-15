import Transaction from './Transaction.mjs';

export default class TransactionPool {
    constructor() {
        this.transactions = [];
    }

    addOrUpdateTransaction(transaction) {
        const transactionIndex = this.transactions.findIndex(t => t.id === transaction.id);
        
        if (transactionIndex >= 0) {
            this.transactions[transactionIndex] = transaction;
        } else {
            this.transactions.push(transaction);
        }
    }

    findTransactionById(id) {
        return this.transactions.find(t => t.id === id);
    }

    clear() {
        this.transactions = [];
    }
}
