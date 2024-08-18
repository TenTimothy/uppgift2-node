import asyncHandler from '../middlewares/asyncHandler.mjs';
import ErrorResponse from '../utils/ErrorResponse.mjs';
import Blockchain from '../models/Blockchain.mjs';
import { pubNubServer, blockchain, transactionPool } from "../server.mjs"; 

// @desc Hämta hela blockkedjan
// @route GET /api/v1/blockchain
// @access PUBLIC

export const getBlockchain = async (req, res, next) => {
    try {
      const blockchain = new Blockchain();
      const chain = blockchain.getChain();
      console.log('Blockchain chain:', chain); // Kontrollera vad som finns i kedjan
  
      const transactions = chain.flatMap(block => block.data);
      console.log('Fetched transactions from blockchain:', transactions); // Kontrollera om transaktionerna finns
  
      res.status(200).json({
        success: true,
        transactions,
      });
    } catch (error) {
      next(error);
    }
  };
  

// @desc Mine ett nytt block
// @route POST /api/v1/blockchain/mine
// @access PRIVATE
export const mineBlock = asyncHandler(async (req, res, next) => {
    const { minerAddress } = req.body;

    if (!minerAddress) {
        return next(new ErrorResponse('Miner address is required', 400));
    }

    const block = blockchain.minePendingTransactions(minerAddress, transactionPool.transactions);

    pubNubServer.broadcast();

    res.status(201).json({ 
        success: true, 
        statusCode: 201, 
        data: block 
    });
});

// @desc Hämta ett specifikt block baserat på index
// @route GET /api/v1/blockchain/:index
// @access PUBLIC
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

// @desc Validera hela blockkedjan
// @route GET /api/v1/blockchain/validate
// @access PUBLIC
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
