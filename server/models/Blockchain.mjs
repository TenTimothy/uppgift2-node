import Block from './Block.mjs'; 
import Transaction from './Transaction.mjs';

export default class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
    }

    getChain() {
        return this.chain;
    }

    addBlock({ data }) {
        const lastBlock = this.chain[this.chain.length - 1];
        const newBlock = Block.mineBlock({ lastBlock, data });
        this.chain.push(newBlock);
        return newBlock;
    }

    minePendingTransactions(minerAddress, transactionPool) {
        if (!minerAddress) {
            throw new Error('Miner address is required');
        }

        if (!Array.isArray(transactionPool)) {
            throw new Error('Transaction pool must be an array');
        }

        const rewardTransaction = Transaction.createRewardTransaction({ minerWallet: { publicKey: minerAddress } });

        transactionPool.push(rewardTransaction);

        const block = this.addBlock({ data: [...transactionPool] });
        transactionPool.length = 0; // Töm transaktionspoolen
        return block;
    }

    replaceChain(newChain) {
        console.log(`Current chain length: ${this.chain.length}`);
        console.log(`New chain length: ${newChain.length}`);
    
        // Lägger till en kontroll om längderna är samma men innehållet skiljer sig
        if (newChain.length < this.chain.length) {
            throw new Error('The incoming chain must be longer');
        }
    
        if (!Blockchain.isValidChain(newChain)) {
            throw new Error('The incoming chain is invalid');
        }
    
        console.log('Replacing the current chain with the new chain.');
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
