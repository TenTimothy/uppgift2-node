import mongoose from 'mongoose';

const SignatureSchema = new mongoose.Schema({
    r: String,
    s: String,
    recoveryParam: Number
});

const TransactionSchema = new mongoose.Schema({
    id: String,
    outputMap: {
        type: Map,
        of: Number
    },
    inputMap: {
        timestamp: Number,
        amount: Number,
        address: String,
        signature: SignatureSchema
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


export default mongoose.model('Transaction', TransactionSchema, 'blockchain-transactions');
