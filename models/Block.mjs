import hexToBinary from 'hex-to-binary';
import { GENESIS_DAT, MINE_RATEA } from '../config/settings.mjs';
import { createHash } from '../utils/crypto-lib.mjs';

export default class Block {
    constructor({ timestamp, lastHash, hash, data, nounce, difficulty}){
        this.timestamp = timestamp,
        this.lastHash = lastHash,
        this.hash = hash;
        this.data = data;
        this.nounce = nounce;
        this.difficulty = difficulty;
    }

    static get genesis() {
        return new this(GENESIS_DAT);
    }

    static mineBlock({ lastHash, data}) {
        const lastHash = lastBlock.hash;

        let { difficulty } = lastBlock;
        let hash, timestamp;
        let nonce = 0;
    }
}