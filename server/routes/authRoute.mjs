import express from 'express';
import { register, login, getMe, forgotPassword, resetPassword } from '../controllers/authController.mjs';
import { protect } from '../middlewares/authorization.mjs';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:token', resetPassword)

export default router;
