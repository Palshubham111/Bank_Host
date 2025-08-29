import express from 'express';
import { login, getAccountData, updateMobile, transfer, updateName } from '../controller/user.controller.js';

const router = express.Router();

// Login route
router.post('/login', login);

// Get account data route
router.get('/account/:accountNumber', getAccountData);

// Update mobile number route
router.post('/update-mobile', updateMobile);

// Update name route
router.post('/update-name', updateName);

// Transfer route
router.post('/transfer', transfer);

export default router; 