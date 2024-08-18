import mongoose from 'mongoose';

const BlockchainSchema = new mongoose.Schema({
    chain: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Block'
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const BlockchainModel = mongoose.model('Blockchain', BlockchainSchema);

export default BlockchainModel;