import { Router } from 'express';
import { getBlockchain, mineBlock, getBlockByIndex, validateBlockchain } from '../controllers/blockchainController.mjs';

const router = Router();


router.get('/', (req, res) => {
    console.log('GET request received at /api/v1/blockchain');
    getBlockchain(req, res);
});


router.get('/validate', (req, res) => {
    console.log('GET request received at /api/v1/blockchain/validate');
    validateBlockchain(req, res);
});


router.get('/:index', (req, res) => {
    console.log('GET request received at /api/v1/blockchain/:index');
    getBlockByIndex(req, res);
});


router.post('/mine', (req, res) => {
    console.log('POST request received at /api/v1/blockchain/mine');
    mineBlock(req, res);
});

export default router;
