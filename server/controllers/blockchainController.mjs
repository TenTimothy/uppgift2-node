import asyncHandler from '../middlewares/asyncHandler.mjs';
import ErrorResponse from '../utils/ErrorResponse.mjs';
import Blockchain from '../models/Blockchain.mjs';
import BlockchainDBModel from '../models/BlockchainDBModel.mjs';
import { pubNubServer, blockchain, transactionPool, wallet } from "../server.mjs"; 



export const getBlockchain = (req, res) => {
    try {
        const chain = blockchain.getChain(); 

        if (chain.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Blockchain is empty',
            });
        }

        res.status(200).json({
            success: true,
            blockchain: chain, 
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching the blockchain',
            error: error.message,
        });
    }
};

  
export const mineBlock = (req, res, next) => {
    try {
        const { minerAddress } = req.body;

        if (!minerAddress) {
            return res.status(400).json({
                success: false,
                message: 'Miner address is required',
            });
        }

        
        const newBlock = blockchain.minePendingTransactions(wallet.publicKey, transactionPool);

        res.status(201).json({
            success: true,
            data: newBlock,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'An error occurred while mining the block',
            error: error.message,
        });
    }
};


export const getBlockByIndex = asyncHandler(async (req, res, next) => {
    const { index } = req.params;
    const blockIndex = parseInt(index, 10);

    if (isNaN(blockIndex) || blockIndex < 0 || blockIndex >= blockchain.getChain().length) {
        return next(new ErrorResponse('Invalid block index', 400));
    }

    const block = blockchain.getChain()[blockIndex];
    res.status(200).json({ 
        success: true, 
        data: block 
    });
});


export const validateBlockchain = asyncHandler(async (req, res, next) => {
    try {
        const chain = blockchain.getChain();
        const isValid = Blockchain.isValidChain(chain);
        res.status(200).json({ 
            success: true, 
            valid: isValid 
        });
    } catch (error) {
        return next(new ErrorResponse("Server error during blockchain validation", 500));
    }
});


export const saveBlockchain = async (blockchain) => {
    try {
        let blockchainDoc = await BlockchainDBModel.findOne({});
        if (blockchainDoc) {
            blockchainDoc.blockchain = blockchain;
        } else {
            blockchainDoc = new BlockchainDBModel({ blockchain });
        }
        await blockchainDoc.save();
        console.log("Blockchain saved to database.");
    } catch (err) {
        console.error("Error saving blockchain to database:", err);
    }
};


export const loadBlockchain = async () => {
    try {
        const blockchainDoc = await BlockchainDBModel.findOne({});
        if (blockchainDoc) {
            return blockchainDoc.blockchain;
        } else {
            console.log("No blockchain found in the database.");
            return null;
        }
    } catch (err) {
        console.error("Error loading blockchain from database:", err);
        return null;
    }
};
