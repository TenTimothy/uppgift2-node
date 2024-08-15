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
    const isValid = blockchain.validateChain();
    res.status(200).json({ success: isValid, valid: isValid });
};

export const mineBlock = (req, res, next) => {
    const data = req.body;

    const block = blockchain.addBlock({ data: data});

    pubNubServer.broadcast();

    res.status(201).json({ success: true, satusCode: 201, data: block });
};
