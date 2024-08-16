import fs from 'fs';
import Blockchain from '../models/Blockchain.mjs';

describe('Blockchain Persistence', () => {
    let blockchain;

    beforeEach(() => {
       
        if (fs.existsSync('./data/blockchain.json')) {
            fs.unlinkSync('./data/blockchain.json');
        }

        blockchain = new Blockchain();
    });

    test('should save blockchain to a JSON file', () => {
        blockchain.addBlock({ data: 'block 1' });
        blockchain.saveBlockchain();

        const loadedData = JSON.parse(fs.readFileSync('./data/blockchain.json'));
        expect(loadedData.length).toBe(2);
    });

    test('should load blockchain from a JSON file', () => {
        blockchain.addBlock({ data: 'block 1' });
        blockchain.saveBlockchain();

        const loadedBlockchain = new Blockchain();
        loadedBlockchain.loadBlockchain();

        expect(loadedBlockchain.getChain().length).toBe(2); 
    });
});
