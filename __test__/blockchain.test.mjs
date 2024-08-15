import { it, describe, expect, beforeEach } from 'vitest';
import Blockchain from '../models/Blockchain.mjs';
import Block from '../models/Block.mjs';

describe('Blockchain', () => {
    let blockchain;

    beforeEach(() => {
        blockchain = new Blockchain();
    });

    it('should start with the genesis block', () => {
        expect(blockchain.getChain()[0]).toEqual(Block.genesis());
    });

    it('should add a new block', () => {
        const data = 'test-data';
        blockchain.addBlock({ data });
        expect(blockchain.getChain().length).toBe(2);
        expect(blockchain.getChain()[1].data).toEqual(data);
    });

    it('should validate a valid chain', () => {
        const blockchain2 = new Blockchain();
        blockchain2.addBlock({ data: 'test' });

        expect(Blockchain.isValidChain(blockchain2.getChain())).toBe(true);
    });

    it('should invalidate a chain with a corrupt genesis block', () => {
        blockchain.getChain()[0].data = 'Bad data';

        expect(Blockchain.isValidChain(blockchain.getChain())).toBe(false);
    });

    it('should invalidate a corrupt chain', () => {
        blockchain.addBlock({ data: 'test' });
        blockchain.getChain()[1].data = 'Bad data';

        expect(Blockchain.isValidChain(blockchain.getChain())).toBe(false);
    });
});
