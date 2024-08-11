import { it, describe, expect, beforeEach} from vitest;
import Wallet from "../models/Wallet.mjs";
import { verifySignature } from "../utils/crypto-lib.mjs";
import Transaction from '..models/Transaction.mjs';

describe('Transaction', () => {
    let transaction, sender, recipient, amount;

    beforeEach(() => {
        sender = new Wallet();
        recipient = 'recipient-dummy-address';
        amount = 50;
        
        transaction = new Transaction({sender, recipient, amount});
    });

    describe('properties', () => {
        it('should have a property named id', () => {
            expect(transaction).toHaveProperty('id');
        });

        
        it('should have a property named outputMap', () => {
            expect(transaction).toHaveProperty('outputMap');
        });


        it('should have a property named inputMap', () => {
            expect(transaction).toHaveProperty('inputMap');
        });
    });
});