import fs from 'fs';
import path from 'path';
import Block from './Block.mjs'; 
import Transaction from './Transaction.mjs'; 
import TransactionModel from './TransactionDB.Model.mjs'
import BlockModel from './BlockDBModel.mjs';
import BlockchainModel from './BlockchainDBModel.mjs';

export default class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
        this.loadBlockchain();
    }

    getChain() {
        return this.chain;ß
    }
    async addBlock({ data }) {
        const lastBlock = this.chain[this.chain.length - 1];
        const newBlock = Block.mineBlock({ lastBlock, data });
        this.chain.push(newBlock);
        console.log('New Block mined:', newBlock);
        console.log('Block data:', newBlock.data); // Lägg till detta för att se innehållet i blocket
        await this.saveBlock(newBlock);
        return newBlock;
    }
    

    async minePendingTransactions(minerAddress, transactionPool) {
        if (!minerAddress) {
            throw new Error('Miner address is required');
        }

        if (!Array.isArray(transactionPool)) {
            throw new Error('Transaction pool must be an array');
        }

        const rewardTransaction = Transaction.createRewardTransaction({ minerWallet: { publicKey: minerAddress } });

        transactionPool.push(rewardTransaction);

        const block = await this.addBlock({ data: [...transactionPool] });
        transactionPool.length = 0; 
        return block;
    }

    async saveBlock(block) {
        try {
            console.log('Saving block:', block);
            const transactionIds = [];
            for (const transaction of block.data) {
                console.log('Saving transaction:', transaction);
                const transactionDocument = await TransactionModel.create(transaction);
                transactionIds.push(transactionDocument._id);
            }
            const blockDocument = await BlockModel.create({
                ...block,
                data: transactionIds
            });
    
            console.log('Saving block document:', blockDocument);
            const blockchainDocument = await BlockchainModel.findOne();
    
            if (blockchainDocument) {
                blockchainDocument.chain.push(blockDocument._id);
                await blockchainDocument.save();
                console.log('Updated blockchain document:', blockchainDocument);
            } else {
                await BlockchainModel.create({ chain: [blockDocument._id] });
                console.log('Created new blockchain document');
            }
        } catch (error) {
            console.error("Error saving block:", error);
        }
    }
    

    async loadBlockchain() {
        try {
            const blockchainDocument = await BlockchainModel.findOne().populate('chain');
            if (blockchainDocument) {
                this.chain = blockchainDocument.chain.map(blockDoc => new Block(blockDoc));
                console.log('Blockchain loaded from database:', this.chain); // Kontrollera vad som laddas
            } else {
                console.log('No existing blockchain found in database. Using genesis block.');
            }
        } catch (error) {
            console.error("Error loading blockchain from database:", error);
        }
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
    

    async saveChainToDatabase() {
        try {
            await BlockchainModel.deleteMany({});
            await BlockModel.deleteMany({});
            
            const blockIds = [];
            for (const block of this.chain) {
                const blockDocument = await BlockModel.create(block);
                blockIds.push(blockDocument._id);
            }
            
            await BlockchainModel.create({ chain: blockIds });
            console.log('Entire blockchain saved to database.');
        } catch (error) {
            console.error("Error saving entire blockchain:", error);
        }
    }
}
