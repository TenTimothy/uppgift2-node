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

export default mongoose.model('Blockchain', BlockchainSchema);
