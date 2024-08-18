import mongoose from 'mongoose';

const BlockSchema = new mongoose.Schema({
    timestamp: Number,
    lastHash: String,
    hash: String,
    data: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Transaction' // Referens till Transaction-modellen
        }
    ],
    nonce: Number,
    difficulty: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Block', BlockSchema);
