import Transaction from './Transaction.mjs';

export default class TransactionPool {
    constructor() {
        this.transactions = {};
    }

    addTransactions(transactions) {
        this.transactions[transactions.id] = transactions;
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

    validateTransactions() {
        const validateTransactions = Object.values(this.transactions).filter(
            (transaction) => Transaction.validate(transaction)
        );
        return validateTransactions; 
    }
}
