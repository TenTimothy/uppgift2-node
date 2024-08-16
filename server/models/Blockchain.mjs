import fs from 'fs';
import path from 'path';
import Block from './Block.mjs'; 
import Transaction from './Transaction.mjs';

const DATA_DIR = './data'; 
const BLOCKCHAIN_FILE = path.join(DATA_DIR, 'blockchain.json');

export default class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
        this.loadBlockchain(); 
    }

    getChain() {
        return this.chain;
    }

    addBlock({ data }) {
        const lastBlock = this.chain[this.chain.length - 1];
        const newBlock = Block.mineBlock({ lastBlock, data });
        this.chain.push(newBlock);
        this.saveBlockchain(); 
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
        transactionPool.length = 0; 
        return block;
    }

    saveBlockchain() {
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR);
        }

        fs.writeFileSync(BLOCKCHAIN_FILE, JSON.stringify(this.chain, null, 2));
    }

    loadBlockchain() {
        if (fs.existsSync(BLOCKCHAIN_FILE)) {
            const fileData = fs.readFileSync(BLOCKCHAIN_FILE, 'utf8');
            const savedChain = JSON.parse(fileData);

            if (Blockchain.isValidChain(savedChain)) {
                this.chain = savedChain;
                console.log('Blockchain loaded from file.');
            } else {
                console.error('Failed to load blockchain. The file contains an invalid chain.');
            }
        }
    }

    replaceChain(newChain) {
        console.log('Current chain length:', this.chain.length);
        console.log('New chain length:', newChain.length);
    
        if (newChain.length <= this.chain.length) {
            console.error('The incoming chain must be longer');
            return;
        }
    
        if (!Blockchain.isValidChain(newChain)) {
            throw new Error('The incoming chain is invalid');
        }
    
        console.log('Replacing the current chain with the new chain.');
        this.chain = newChain;
        this.saveBlockchain(); 
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
