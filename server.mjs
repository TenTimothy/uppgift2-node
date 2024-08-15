import express from 'express'; 
import dotenv from 'dotenv';
import PubNubServerClass from './pubNubServer.mjs'; 
import blockchainRouter from './routes/blockchainRoute.mjs'; 
import blockRoute from './routes/blockRoute.mjs'; 
import Blockchain from './models/Blockchain.mjs'; 

dotenv.config({ path: './config/config.env' });


const credentials = {
    publishKey: process.env.PUBLISH_KEY,
    subscribeKey: process.env.SUBSCRIBE_KEY,
    secretKey: process.env.SECRET_KEY,
    userId: process.env.USER_ID,
};

const blockchain = new Blockchain(); 


const pubNubServer = new PubNubServerClass({ blockchain, credentials });

export { pubNubServer, blockchain };

const app = express();
app.use(express.json());

const DEFAULT_PORT = 3001;
const ROOT_NODE = `http://localhost:${DEFAULT_PORT}`;

let NODE_PORT;


setTimeout(() => {
    pubNubServer.broadcast();
}, 1000);

app.use('/api/v1/blockchain', blockchainRouter);
app.use('/api/v1/block', blockRoute);

const synchronize = async () => {
    const response = await fetch(`${ROOT_NODE}/api/v1/blockchain`);
    if (response.ok) {
        const result = await response.json();
        console.log('SYNC', result.data);
        blockchain.replaceChain(result.data);
    }
};

const PORT = NODE_PORT || DEFAULT_PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);

    if (PORT !== DEFAULT_PORT) {
        synchronize();
    }
});
