import PubNub from "pubnub";
import Transaction from "./models/Transaction.mjs";

const CHANNELS = {
    DEMO: 'DEMO',
    BLOCKCHAIN: 'BLOCKCHAIN',
    TRANSACTION: 'TRANSACTION',
    TRANSACTION_POOL: 'TRANSACTION_POOL',
};


export default class PubNubServer {
    constructor({ blockchain, transactionPool, credentials}) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;

        this.pubnub = new PubNub(credentials); 
        this.pubnub.subscribe({ channels: Object.values(CHANNELS) });
        this.pubnub.addListener(this.listener());
    }

    publish({ channel, message }) {
        this.pubnub.publish(
            { channel, message },
            (status, response) => {
                if (status.error) {
                    console.log(`PubNub publish error: ${status.message}`);
                } else {
                    console.log(`Message published successfully: ${response}`);
                }
            }
        );
    }

    broadcastBlockchain() {
        this.publish({ 
            channel: CHANNELS.BLOCKCHAIN, 
            message: JSON.stringify(this.blockchain.chain) 
        });
    }

    broadcastTransaction(transaction) {
        this.publish({ 
            channel: CHANNELS.TRANSACTION, 
            message: JSON.stringify(transaction) 
        });
    }

    broadcastTransactionPool() {
        this.publish({
            channel: CHANNELS.TRANSACTION_POOL,
            message: JSON.stringify(this.transactionPool.transactions),
        });
    }

    listener() {
        return {
            message: (msgObject) => {
                const { channel, message } = msgObject;
                const parsedMessage = JSON.parse(message); 

                switch (channel) {
                    case CHANNELS.BLOCKCHAIN:
                        this.blockchain.replaceChain(parsedMessage, () => {
                            this.transactionPool.clear();
                        });
                        break;

                    case CHANNELS.TRANSACTION:
                        const {inputMap, outputMap, id} = parsedMessage;
                        const transaction = new Transaction({inputMap, outputMap});
                        transaction.id = id;
                        this.transactionPool.addTransaction(transaction);
                        break;

                    default:
                        return;
                };
            },
        };
    }
}
