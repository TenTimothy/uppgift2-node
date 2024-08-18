import BlockchainDBModel from "./BlockchainDBModel.mjs";

export const saveBlockchain = async (blockchain) => {
    try {
        let blockchainDoc = await BlockchainDBModel.findOne({});
        if (blockchainDoc) {
            blockchainDoc.blockchain = blockchain;
            console.log('Blockchain dokument uppdateras');
        } else {
            blockchainDoc = new BlockchainDBModel({ blockchain });
            console.log('Nytt blockchain dokument skapas');
        }
        await blockchainDoc.save();
        console.log("Blockchain sparad i databasen.");
    } catch (err) {
        console.error("Fel vid sparande av blockchain till databasen:", err);
    }
};
