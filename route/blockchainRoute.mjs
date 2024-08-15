import { Router } from 'express';
import { getBlockchain, mineBlock, getBlockByIndex, validateBlockchain } from '../controllers/blockchainController.mjs';

const router = Router();

// GET /api/v1/blockchain - Hämta hela blockkedjan
router.get('/', (req, res) => {
    console.log('GET request received at /api/v1/blockchain');
    getBlockchain(req, res);
});

// POST /api/v1/blockchain/mine - "Mine" ett nytt block
router.post('/mine', (req, res) => {
    console.log('POST request received at /api/v1/blockchain/mine');
    mineBlock(req, res);
});

// GET /api/v1/blockchain/:index - Hämta ett specifikt block baserat på index
router.get('/:index', (req, res) => {
    console.log('GET request received at /api/v1/blockchain/:index');
    getBlockByIndex(req, res);
});

// GET /api/v1/blockchain/validate - Validera hela blockkedjan
router.get('/validate', (req, res) => {
    console.log('GET request received at /api/v1/blockchain/validate');
    validateBlockchain(req, res);
});

export default router;
