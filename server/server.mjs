import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; 
import authRouter from './routes/authRoute.mjs';
import walletRouter from './routes/walletRoutes.mjs';
import { connectDb } from './config/mongo.mjs';
import colors from 'colors';
import morgan from 'morgan';
import PubNubServerClass from './pubNubServer.mjs';
import blockchainRouter from './routes/blockchainRoute.mjs';
import transactionRoute from './routes/transactionRoute.mjs';
import transactionPoolRoute from './routes/transactionPoolRoute.mjs';
import Blockchain from './models/Blockchain.mjs';
import TransactionPool from './models/TransactionPool.mjs';
import Wallet from './models/Wallet.mjs';
import { errorHandler } from './middlewares/errorHandler.mjs';
import { saveBlockchain } from './controllers/blockchainController.mjs';

dotenv.config({ path: './config/config.env' });

connectDb();

const app = express();

app.use(cors({
    origin: 'http://localhost:5174', 
    credentials: true, 
}));

app.use(express.json());
app.use(morgan('dev'));

const credentials = {
    publishKey: process.env.PUBLISH_KEY,
    subscribeKey: process.env.SUBSCRIBE_KEY,
    secretKey: process.env.SECRET_KEY,
    userId: process.env.USER_ID,
};

const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubNubServer = new PubNubServerClass({ blockchain, credentials });

export { pubNubServer, blockchain, transactionPool, wallet };


let NODE_PORT = +process.env.PORT || 3001;
let ROOT_NODE = `http://localhost:${NODE_PORT}`;

if (process.env.GENERATE_NODE_PORT === 'true') {
    
    // NODE_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
    NODE_PORT = 3002; 
}



app.use('/api/v1/auth', authRouter);
app.use('/api/v1/blockchain', blockchainRouter);
app.use('/api/v1/transactions', transactionRoute);
app.use('/api/v1/transaction-pool', transactionPoolRoute);
app.use('/api/v1/wallet', walletRouter);  

app.use(errorHandler);

const synchronizeNode = async () => {
    let response = await fetch(`${ROOT_NODE}/api/v1/blockchain`);
    if(response.ok) {
        const result = await response.json();
        blockchain.replaceChain(result.data);
    }

    response = await fetch(`${ROOT_NODE}/api/v1/transaction-pool`);
    if (response.ok) {
        const result = await response.json();
        transactionPool.transactions = result.data;
    }
};


const server = app.listen(NODE_PORT, () => {
    console.log(`Server is running on port: ${NODE_PORT}`.bgYellow);
    if(NODE_PORT !== 3001) {
        synchronizeNode();
    }
    saveBlockchain(blockchain.chain);
});

