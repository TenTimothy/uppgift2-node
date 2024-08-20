import Transaction from './Transaction.mjs';

export default class TransactionPool {
    constructor() {
        this.transactions = {};
    }

    addTransactions(transactions) {
        this.transactions[transactions.id] = transactions;
    }

    addOrUpdateTransaction(transaction) {
        const transactionIndex = this.transactions.findIndex(t => t.id === transaction.id);

        if (transactionIndex >= 0) {
            this.transactions[transactionIndex] = transaction;
        } else {
            this.transactions.push(transaction);
        }
    }

    getTransaction(id) {
        return this.transactions.find(t => t.id === id);
    }

    clear() {
        this.transactions = [];
    }

    clearBlockchainTransactions(chain) {
        for (let i = 1; i < chain.length; i++) {
            const block = chain[i];

            for (let transaction of block.data) {
                this.transactions = this.transactions.filter(t => t.id !== transaction.id);
            }
        }
    }
}
