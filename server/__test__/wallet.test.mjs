import { it, describe, expect, beforeEach, vi } from 'vitest';
import Wallet from '../models/Wallet.mjs';
import { verifySignature } from '../utils/crypto-lib.mjs';
import Transaction from '../models/Transaction.mjs';
import Blockchain from '../models/Blockchain.mjs';
import { INITIAL_BALANCE } from '../config/settings.mjs';

describe('Wallet', () => {
    let wallet;

    beforeEach(() => {
        wallet = new Wallet();
    });

    describe('properties', () => {
        it('should have a property named balance', () => {
            expect(wallet).toHaveProperty('balance');
        });

        it('should have a property named publicKey', () => {
            expect(wallet).toHaveProperty('publicKey');
        });
    });

    describe('Signing process', () => {
        let data = 'test-data';

        it('should verify a signature', () => {
            expect(
                verifySignature({
                    publicKey: wallet.publicKey,
                    data,
                    signature: wallet.sign(data),
                })
            ).toBe(true);
        });

        it('should not verify an invalid signature', () => {
            expect(
                verifySignature({
                    publicKey: wallet.publicKey,
                    data,
                    signature: new Wallet().sign(data),
                })
            ).toBe(false);
        });
    });

    describe('Calculate the balance', () => {
        let blockchain;

        beforeEach(() => {
            blockchain = new Blockchain();
        });

        describe('and there is no output for the wallet', () => {
            it('should return the initial balance (starting balance)', () => {
                expect(
                    Wallet.calculateBalance({
                        chain: blockchain.chain, 
                        address: wallet.publicKey 
                    })
                ).toEqual(INITIAL_BALANCE);
            });
        });
    });
});
