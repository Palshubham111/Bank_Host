import express from "express";
import { getRESULTBYACC, getSbidata, updateMobile, openAccount } from "../controller/accdata.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import multer from 'multer';
import path from 'path';
import accdata from '../model/accdata.model.js';
import Transaction from '../model/transaction.model.js';

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Apply auth middleware to protected routes
router.use(authMiddleware);

// Get all accounts
router.get("/", getSbidata);

// Get account by account number
router.get("/:acc", getRESULTBYACC);

// Update mobile number
router.patch("/:acc/mobile", updateMobile);

// Open new account with multiple file uploads (no auth required)
router.post("/open", upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'aadharPhoto', maxCount: 1 },
  { name: 'panPhoto', maxCount: 1 }
]), openAccount);

// Deposit money to account
router.post('/deposit', async (req, res) => {
  const { amount } = req.body;
  const accountNumber = req.accountNumber; // Use accountNumber from the authenticated token

  if (!accountNumber || !amount) {
    return res.status(400).json({ message: 'Account number and amount are required.' });
  }
  try {
    const account = await accdata.findOne({ 'A/C NO': accountNumber });
    if (!account) {
      return res.status(404).json({ message: 'Account not found.' });
    }
    account.AMOUNT += Number(amount);
    await account.save();

    const transaction = new Transaction({
      accountNumber,
      type: 'deposit',
      amount: Number(amount),
      description: 'Cash deposit'
    });
    console.log('Saving transaction:', transaction);
    await transaction.save();

    res.json({ message: 'Deposit successful.', newBalance: account.AMOUNT });
  } catch (err) {
    console.error('Error during deposit:', err);
    res.status(500).json({ message: 'Server error during deposit.', error: err.message });
  }
});

router.get('/transactions/:accountNumber', async (req, res) => {
  try {
    const { accountNumber } = req.params;
    console.log('Fetching transactions for account number:', accountNumber);
    const transactions = await Transaction.find({ accountNumber }).sort({ timestamp: -1 });
    console.log('Found transactions:', transactions);
    res.json(transactions);
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ message: 'Server error fetching transactions.', error: err.message });
  }
});

export default router;