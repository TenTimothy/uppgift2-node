import { v4 as uuidv4 } from 'uuid';
import { verifySignature } from '../utils/crypto-lib.mjs';
import { MINING_REWARD, REWARD_INPUT } from '../config/settings.mjs';

export default class Transaction {
    constructor({ sender, recipient, amount, outputMap, inputMap }) {
        this.id = uuidv4().replaceAll('-', '');
        this.outputMap = outputMap || this.createOutputMap({ sender, recipient, amount });
        this.inputMap = inputMap || this.createInputMap({ sender, outputMap: this.outputMap });
    }

    static validate(transaction) {
        const { inputMap: { address, amount, signature }, outputMap } = transaction;

        const outputTotal = Object.values(outputMap).reduce((total, amount) => total + amount, 0);

        if (amount !== outputTotal) return false;

        if (!verifySignature({ publicKey: address, data: outputMap, signature })) return false;

        return true;
    }

    update({ sender, recipient, amount }) {
        if (amount > this.outputMap[sender.publicKey]) {
            throw new Error('Amount exceeds balance');
        }

        if (!this.outputMap[recipient]) {
            this.outputMap[recipient] = amount;
        } else {
            this.outputMap[recipient] += amount;
        }

        this.outputMap[sender.publicKey] -= amount;
        this.inputMap = this.createInputMap({ sender, outputMap: this.outputMap });
    }

    createOutputMap({ sender, recipient, amount }) {
        const outputMap = {};

        if (sender.address === REWARD_INPUT.address) {
            outputMap[recipient] = amount;
        } else {
            outputMap[recipient] = amount;
            outputMap[sender.publicKey] = sender.balance - amount;
        }

        return outputMap;
    }

    createInputMap({ sender, outputMap }) {
        if (sender.address === REWARD_INPUT.address) {
            return {
                timestamp: Date.now(),
                amount: MINING_REWARD,
                address: REWARD_INPUT.address,
                signature: null
            };
        }

        return {
            timestamp: Date.now(),
            amount: sender.balance,
            address: sender.publicKey,
            signature: sender.sign(outputMap),
        };
    }

    static createRewardTransaction({ minerWallet }) {
        return new this({
            sender: REWARD_INPUT,
            recipient: minerWallet.publicKey,
            amount: MINING_REWARD,
        });
    }
}
