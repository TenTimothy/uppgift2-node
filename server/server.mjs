import express from 'express'; 
import dotenv from 'dotenv';
import { connectDb } from './config/mongo.mjs';
import colors from 'colors';
import morgan from 'morgan';
import PubNubServerClass from './pubNubServer.mjs'; 
import blockchainRouter from './routes/blockchainRoute.mjs'; 
import transactionRoute from './routes/transactionRoute.mjs'; 
import transactionPoolRoute from './routes/transactionPoolRoute.mjs'; 
import Blockchain from './models/Blockchain.mjs'; 
import TransactionPool from './models/TransactionPool.mjs';

dotenv.config({ path: './config/config.env' });

connectDb();

const credentials = {
    publishKey: process.env.PUBLISH_KEY,
    subscribeKey: process.env.SUBSCRIBE_KEY,
    secretKey: process.env.SECRET_KEY,
    userId: process.env.USER_ID,
};

const blockchain = new Blockchain(); 
const transactionPool = new TransactionPool();
const pubNubServer = new PubNubServerClass({ blockchain, credentials });

export { pubNubServer, blockchain, transactionPool };

const app = express();
app.use(express.json());

const DEFAULT_PORT = 3001;
const ROOT_NODE = `http://localhost:${DEFAULT_PORT}`;

let NODE_PORT;

setTimeout(() => {
    pubNubServer.broadcast();
}, 1000);

app.use(morgan('dev'));
app.use('/api/v1/blockchain', blockchainRouter);
app.use('/api/v1/transactions', transactionRoute); 
app.use('/api/v1/transaction-pool', transactionPoolRoute);

const synchronize = async () => {
    const response = await fetch(`${ROOT_NODE}/api/v1/blockchain`);
    if (response.ok) {
        const result = await response.json();
        console.log('SYNC', result.data);

        if (result.data.length > blockchain.getChain().length) {
            blockchain.replaceChain(result.data);
        } else {
            console.log('The local chain is already longer or equal; no replacement needed.');
        }
    }
};


const synchronizeTransactionPool = async () => {
    const response = await fetch(`${ROOT_NODE}/api/v1/transaction-pool`);
    if (response.ok) {
        const result = await response.json();
        console.log('SYNC Transaction Pool', result.data);
        transactionPool.setTransactions(result.data);
    }
};

if (process.env.GENERATE_NODE_PORT === 'true') {
  //NODE_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
  NODE_PORT = 3002;
}

const PORT = NODE_PORT || DEFAULT_PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`.bgYellow);

    if (PORT !== DEFAULT_PORT) {
        synchronize();
        synchronizeTransactionPool(); 
    }
});

//Hantera fel(Rejections) som inte hanteras någon annanstans i applikationen...
process.on('unhandledRejection', (err, promise) => {
    console.log(`FEL: ${err.message}`, red);
    server.close(() => process.exit(1));
});
