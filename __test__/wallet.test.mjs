import { it, describe, expect, beforeEach } from 'vitest';
import Wallet from './models/Wallet.mjs';

describe('Wallet', ()=> {
    let Wallet;

    beforeEach(() =>{
        wallet = new Wallet();
    
    });

    describe('properties', () => {
        it('should have a property named balance', () => {
            expect(wallet).toHaveProperty('balance');
        });
        it('should have a propert named publicKey', () => {
            expect(wallet).toHAveProperty('publicKey');
        });
    });
});