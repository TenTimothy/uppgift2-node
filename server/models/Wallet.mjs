import { INITIAL_BALANCE } from "../config/settings.mjs";
import { ellipticHash, createHash } from "../utils/crypto-lib.mjs";
import Transaction from "./Transaction.mjs";

export default class Wallet {
    constructor() {
        this.balance = INITIAL_BALANCE;
        this.keyPair = ellipticHash.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encodeCompressed('hex');
    };

    sign(data) {
        return this.keyPair.sign(createHash(data));
    };

    createTransaction({ recipient, amount, chain }) {
        if (chain) {
            this.balance = this.constructor.calculateBalance({
                chain,
                address: this.publicKey,
            });
        }

        if (amount > this.balance) {
            throw new Error('Not enough funds!');
        }

        return new Transaction({ sender: this, recipient, amount });
    }

    static calculateBalance({ chain, address }) {
        let total = 0;
        let hasAddedTransaction = false;

        for (let i = chain.length - 1; i > 0; i--) {
            const block = chain[i];

            for (let transaction of block.data) {
                if (transaction.inputMap.address === address) {
                    hasAddedTransaction = true;
                }

                const value = transaction.outputMap[address];

                if (value) {
                    total += value;
                }
            }

            if (hasAddedTransaction) {
                break;
            }
        }

        return hasAddedTransaction ? total : INITIAL_BALANCE + total;
    }
}
