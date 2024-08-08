import { INITIAL_BALANCE } from "../config/settings.mjs";
import { ellipticHash, createHash } from "../utils/crypto-lib.mjs";


export default class Wallet {
    constructor() {
        this.balance = INITIAL_BALANCE;
        this.keyPair = ellipticHash.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encodeCompressed('hex');
    };

    sign(data) {
        return this.keyPair.sign(createHash(data));
    };
};
