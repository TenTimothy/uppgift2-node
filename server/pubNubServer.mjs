import PubNub from "pubnub";
import Transaction from "./models/Transaction.mjs";

const CHANNELS = {
    DEMO: 'DEMO',
    BLOCKCHAIN: 'BLOCKCHAIN',
    TRANSACTION: 'TRANSACTION',
};


export default class PubNubServer {
    constructor({ blockchain, credentials}) {
        this.blockchain = blockchain;

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

    broadcast() {
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

    listener() {
        return {
            message: (msgObject) => {
                const { channel, message } = msgObject;
                const msg = JSON.parse(message);
                console.log(`Meddelande mottagits på kanal: ${channel}, meddelande: ${message}`);

                switch (channel) {
                    case CHANNELS.BLOCKCHAIN:
                        this.blockchain.replaceChain(msg, () => {
                            this.transactionPool.clear();
                        });
                        console.log('DEF');
                        break;

                    case CHANNELS.TRANSACTION:
                        const {inputMap, outputMap, id} = msg
                        const transaction = new Transaction({inputMap, outputMap});
                        transaction.id = id;
    
                        this.transactionPool.addTransaction(transaction);
                        console.log('ABC')
                        break;

                    default:
                        return;
                };
            },
        };
    }
}
