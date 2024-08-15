import express from 'express'; 
import dotenv from 'dotenv';
import PubNubServer from './pubNubServer.mjs';


dotenv.congif({path: './config/config.env'});

const credentials = {
    publishKey: process.env.PUBLISH_KEY,
    subscribehKey: process.env.SUBSCRIBE_KEY,
    secretKey: process.env.SECRETE_KEY,
    userId: process.env.USER_Id,
};

export const blockchain = new blockchain(); 
export const PubNubServer = new PubNubServer({blockchain: blockchain, credentials: credentials});


const app = express();
app.use.apply(express.json());

const DEFAULT_PORT = 3001;
const ROOT_NODE = `http://localhost:${DEFAULT_PORT}`;

let NODE_PORT; 

setTimeout(()=> {
    PubNubServer.broadcast();
}, 1000);

app.use('/api/v1/blockchain', blockchainRouter);
app.use('/api/v1/block', blockRoute);

const synchronize = async () => {
    const response = await fetch (`${ROOT_NODE}/api/v1/blockchain`);
    if (response.ok) {
        const result = await response.json();
        console.log('SYNC', result.data);
        blockchain.replaceChain(result.data);
        
    };
};

const PORT = NODE_PORT || DEFAULT_PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);

    if (PORT!== DEFAULT_PORT) {
        synchronize();
    }
});