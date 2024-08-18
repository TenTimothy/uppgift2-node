import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    id: String,
    outputMap: Object,
    inputMap: Object,
});

const blockSchema = new mongoose.Schema({
    timestamp: Number,
    lastHash: String,
    hash: String,
    data: [transactionSchema],
    nonce: Number,
    difficulty: Number,
});

const blockchainSchema = new mongoose.Schema({
    blockchain: [blockSchema],
});

const BlockchainDBModel = mongoose.model('Blockchain', blockchainSchema);

export default BlockchainDBModel;
