import mongoose from 'mongoose';

const BlockSchema = new mongoose.Schema({
    timestamp: Number,
    lastHash: String,
    hash: String,
    data: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Transaction' 
        }
    ],
    nonce: Number,
    difficulty: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const BlockModel = mongoose.model('Block', BlockSchema);

export default BlockModel;