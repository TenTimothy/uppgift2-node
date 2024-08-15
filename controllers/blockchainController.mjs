import Blockchain from '../models/Blockchain.mjs'; 
import { pubNubServer, blockchain } from "../server.mjs";


export const getBlockchain = (req, res, next) => {
    console.log('Handling GET /api/v1/blockchain');
    try {
        res.status(200).json({
            success: true,
            data: blockchain.getChain()  
        });
    } catch (error) {
        return next(error);
    }
};;

export const getBlockByIndex = (req, res, next) => {
    const { index } = req.params;
    const blockIndex = parseInt(index, 10);

    if (isNaN(blockIndex) || blockIndex < 0 || blockIndex >= blockchain.getChain().length) {
        return res.status(400).json({ success: false, message: 'Invalid block index' });
    }

    const block = blockchain.getChain()[blockIndex];
    res.status(200).json({ success: true, data: block });
};

export const validateBlockchain = (req, res, next) => {
    try {
        console.log("Starting blockchain validation...");
        const chain = blockchain.getChain();
        const isValid = Blockchain.isValidChain(chain);
        console.log("Blockchain validation result:", isValid);
        res.status(200).json({ success: true, valid: isValid });
    } catch (error) {
        console.error("Error during blockchain validation:", error.message);
        if (typeof next === 'function') {
            next(error);
        } else {
            res.status(500).json({ success: false, message: "Server error" });
        }
    }
};

export const mineBlock = (req, res, next) => {
    const data = req.body;

    const block = blockchain.addBlock({ data: data});

    pubNubServer.broadcast();

    res.status(201).json({ success: true, satusCode: 201, data: block });
};
