import PubNub from "pubnub";

const CHANNELS = {
    DEMO: 'DEMO',
    BLOCKCHAIN: 'BLOCKCHAIN',
};

const credentials = {
    publishKey: 'pub-c-d450cc19-c7dd-4a79-8658-ea000fc48fb0',
    subscribeKey: 'sub-c-aee1d383-c86e-46ff-99fe-0a73e8b6f65c',
    secretKey: 'sec-c-NzVmYjNkMTktOGQyZS00OTQ1LWE5ZDYtMjNjODdkY2YxNThm', 
    userId: 'saba-test',
};

export default class PubNubServer {
    constructor({ blockchain }) {
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

    listener() {
        return {
            message: (msgObject) => {
                const { channel, message } = msgObject;
                const msg = JSON.parse(message);
                console.log(`Meddelande mottagits på kanal: ${channel}, meddelande: ${message}`);

                if (channel === CHANNELS.BLOCKCHAIN) {
                    this.blockchain.replaceChain(msg);
                }
            },
        };
    }
}
