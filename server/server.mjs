import express from 'express'; 
import dotenv from 'dotenv';
import authRouter from './routes/authRoute.mjs';
import { connectDb } from './config/mongo.mjs';
import colors from 'colors';
import morgan from 'morgan';
import PubNubServerClass from './pubNubServer.mjs'; 
import blockchainRouter from './routes/blockchainRoute.mjs'; 
import transactionRoute from './routes/transactionRoute.mjs'; 
import transactionPoolRoute from './routes/transactionPoolRoute.mjs'; 
import Blockchain from './models/Blockchain.mjs'; 
import TransactionPool from './models/TransactionPool.mjs';
import { errorHandler } from './middlewares/errorHandler.mjs';  // Importera errorHandler

//import path from 'path';
//import { fileURLTOPath } from 'url';


dotenv.config({ path: './config/config.env' });

connectDb();

//const fileName = fileURLToPath(import.meta.url);
//const dirname = path.dirname(fileName);
//global.__appdir = dirname;


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
app.use('/api/v1/auth', authRouter);

app.use(morgan('dev'));
app.use('/api/v1/blockchain', blockchainRouter);
app.use('/api/v1/transactions', transactionRoute); 
app.use('/api/v1/transaction-pool', transactionPoolRoute);

// Lägg till errorHandler som sista middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`.bgYellow);
});

// Hantera fel (Rejections) som inte hanteras någon annanstans i applikationen...
process.on('unhandledRejection', (err, promise) => {
    console.log(`FEL: ${err.message}`);
    server.close(() => process.exit(1));
});
