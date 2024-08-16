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
    
        console.log('Transaction Pool after adding:', this.transactions);
    }

    // Hitta en transaktion baserat på ID
    findTransactionById(id) {
        return this.transactions.find(t => t.id === id);
    }

    // Töm transaktionspoolen
    clear() {
        this.transactions = [];
    }
}
