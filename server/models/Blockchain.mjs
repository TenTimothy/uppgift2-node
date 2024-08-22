import fs from 'fs';
import path from 'path';
import Block from './Block.mjs';
import Transaction from './Transaction.mjs';
import { fileURLToPath } from 'url';
import { GENESIS_DATA } from '../config/settings.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BLOCKCHAIN_FILE = path.join(__dirname, '../data/blockchainLogs/blockchain.json');

export default class Blockchain {
    constructor() {
        this.chain = this.loadBlockchain(); 
    }

    getChain() {
        return this.chain;
    }

    addBlock({ data }) {
        const lastBlock = this.chain[this.chain.length - 1];
        const newBlock = Block.mineBlock({ lastBlock, data });
        this.chain.push(newBlock);
        //Här krånglar det med nodemon//
        this.saveBlockchainToFile();
        return newBlock;
    }

    loadBlockchain() {
        try {
            if (fs.existsSync(BLOCKCHAIN_FILE)) {
                const fileData = fs.readFileSync(BLOCKCHAIN_FILE, 'utf8');
                const chain = JSON.parse(fileData).map(block => new Block(block));
              
                return chain;
            } else {
                
                const genesisBlock = [Block.genesis()];
                this.saveBlockchainToFile(genesisBlock); 
                return genesisBlock;
            }
        } catch (error) {
            console.error("Error loading blockchain from file:", error);
            const genesisBlock = [Block.genesis()];
            this.saveBlockchainToFile(genesisBlock); 
            return genesisBlock;
        }
    }

    saveBlockchainToFile(chain = this.chain) {
        try {
            const dataDir = path.dirname(BLOCKCHAIN_FILE);
            if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true });
            }

            fs.writeFileSync(BLOCKCHAIN_FILE, JSON.stringify(chain, null, 2), 'utf-8');
            
        } catch (error) {
            
        }
    }

    minePendingTransactions(minerAddress, transactionPool) {
        const rewardTransaction = Transaction.createRewardTransaction({ minerWallet: { publicKey: minerAddress } });
        const pendingTransactions = transactionPool.validateTransactions()
        const blockData = [...pendingTransactions, rewardTransaction];
        const newBlock = this.addBlock({ data: blockData });
        transactionPool.clear();
        return newBlock;
    }

    replaceChain(chain, callback){
        if(chain.length <= this.chain.length) return;
        if(!Blockchain.isValidChain(chain)) return;

        if(callback) callback();

        this.chain = chain;
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
