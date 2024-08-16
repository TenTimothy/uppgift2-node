import hexToBinary from 'hex-to-binary';
import { GENESIS_DATA } from '../config/settings.mjs'; 
import { createHash } from '../utils/crypto-lib.mjs';

export default class Block {
    constructor({ timestamp, lastHash, hash, data, nonce, difficulty }) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty;
    }

    static genesis() {
        return new this(GENESIS_DATA);
    }

    static mineBlock({ lastBlock, data }) {
        const lastHash = lastBlock.hash;
        let { difficulty } = lastBlock;
        let hash, timestamp;
        let nonce = 0;

        do {
            nonce++;
            timestamp = Date.now();
            hash = Block.calculateHash({ timestamp, lastHash, data, nonce, difficulty });
        } while (hexToBinary(hash).substring(0, difficulty) !== '0'.repeat(difficulty));

        return new this({ timestamp, lastHash, hash, data, nonce, difficulty });
    }

    static calculateHash({ timestamp, lastHash, data, nonce, difficulty }) {
        return createHash(timestamp, lastHash, data, nonce, difficulty);
    }
}
