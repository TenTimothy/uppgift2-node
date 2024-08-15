import Block from './Block.mjs';
import Transaction from './Transaction.mjs';

export default class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
        this.transactionPool = [];
    }

    addBlock({ data }) {
        const lastBlock = this.chain[this.chain.length - 1];
        const newBlock = Block.mineBlock({ lastBlock, data });
        this.chain.push(newBlock);
        return newBlock;
    }

    addTransaction(transaction) {
        if (Transaction.validate(transaction)) {
            this.transactionPool.push(transaction);
        } else {
            throw new Error('Invalid transaction');
        }
    }

    minePendingTransactions(minerAddress) {
        const rewardTransaction = Transaction.createRewardTransaction(minerAddress);
        this.transactionPool.push(rewardTransaction);

        const block = this.addBlock({ data: this.transactionPool });
        this.transactionPool = [];
        return block;
    }

    replaceChain(newChain) {
        if (newChain.length <= this.chain.length) {
            throw new Error('The incoming chain must be longer');
        }

        if (!Blockchain.isValidChain(newChain)) {
            throw new Error('The incoming chain is invalid');
        }

        this.chain = newChain;
    }

    static isValidChain(chain) {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false;

        for (let i = 1; i < chain.length; i++) {
            const { timestamp, lastHash, hash, nonce, difficulty, data } = chain[i];
            const lastBlock = chain[i - 1];

            if (lastHash !== lastBlock.hash) return false;

            const recalculatedHash = Block.calculateHash({ timestamp, lastHash, data, nonce, difficulty });
            if (hash !== recalculatedHash) return false;
        }

        return true;
    }
}
