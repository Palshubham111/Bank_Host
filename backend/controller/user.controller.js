import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../model/user.model.js';
import accdata from '../model/accdata.model.js';
import Transaction from '../model/transaction.model.js';
import mongoose from 'mongoose';


// export const signup = async (req, res) => {
//   try {
//     const { fullname, email, password } = req.body;

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create new user
//     const newUser = new User({
//       fullname,
//       email,
//       password: hashedPassword
//     });

//     // Save user to database
//     await newUser.save();

//     res.status(201).json({ message: 'User created successfully' });
//   } catch (error) {
//     console.error('Signup error:', error);
//     res.status(500).json({ message: 'Error creating user', error: error.message });
//   }
// };

// Login controller
export const login = async (req, res) => {
  try {
    const { accountNumber } = req.body;

    // Find account data using account number
    const accountData = await accdata.findOne({ "A/C NO": accountNumber });
    
    if (!accountData) {
      return res.status(401).json({ message: 'Invalid account number' });
    }

    console.log('Found account data from DB:', accountData);

    // Generate JWT token
    const token = jwt.sign(
      { accountNumber: accountData["A/C NO"] },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' }
    );

    // Create user response object
    const userResponse = {
      fullname: accountData["Name"],
      accountNo: accountData["A/C NO"],
      balance: accountData["Balance"],
      mobile: accountData["mobile"],
      accountType: accountData["A/C TYPE"],
      address: accountData["address"],
      dateOfBirth: accountData["dateOfBirth"],
      email: accountData["email"],
      pan: accountData["panNumber"],
      aadhar:accountData["aadharNumber"],
      createdAt: accountData["createdAt"]
    };

    console.log('User response object:', userResponse); // Debug log

    const responseData = {
      message: 'Login successful',
      token,
      user: userResponse
    };

    console.log('Sending response:', responseData); // Debug log

    res.json(responseData);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

// Get account data
export const getAccountData = async (req, res) => {
  try {
    const { accountNumber } = req.params;

    // Find account data
    const accountData = await accdata.findOne({ "A/C NO": accountNumber });
    
    if (!accountData) {
      return res.status(404).json({ message: 'Account not found' });
    }

    const responseData = {
      ...accountData.toObject(),
      Balance: accountData.AMOUNT
    };

    res.json(responseData);
  } catch (error) {
    console.error('Get account data error:', error);
    res.status(500).json({ message: 'Error fetching account data', error: error.message });
  }
};

// Update mobile number
export const updateMobile = async (req, res) => {
  try {
    const { accountNumber, newMobile } = req.body;

    // Validate input
    if (!accountNumber || !newMobile) {
      return res.status(400).json({ message: 'Account number and mobile number are required' });
    }

    // Validate mobile number format
    if (!/^[0-9]{10}$/.test(newMobile)) {
      return res.status(400).json({ message: 'Invalid mobile number format' });
    }

    // Find account
    const accountData = await accdata.findOne({ "A/C NO": accountNumber });
    if (!accountData) {
      return res.status(404).json({ message: 'Account not found' });
    }

    // Update mobile number
    const updatedAccount = await accdata.findOneAndUpdate(
      { "A/C NO": accountNumber },
      { $set: { "Mobile": newMobile } },
      { new: true }
    );

    if (!updatedAccount) {
      return res.status(500).json({ message: 'Failed to update mobile number' });
    }

    res.json({
      message: 'Mobile number updated successfully',
      mobile: newMobile,
      account: updatedAccount
    });

  } catch (error) {
    console.error('Update mobile error:', error);
    res.status(500).json({ message: 'Error updating mobile number', error: error.message });
  }
};

// Transfer controller
export const transfer = async (req, res) => {
  try {
    const { fromAccount, toAccount, amount, description } = req.body;
    const transferAmount = Number(amount);

    if (!fromAccount || !toAccount || !transferAmount || transferAmount <= 0) {
      return res.status(400).json({ message: 'Invalid transfer details' });
    }
    if (fromAccount === toAccount) {
      return res.status(400).json({ message: 'Cannot transfer to the same account.' });
    }

    const senderAccount = await accdata.findOne({ "A/C NO": fromAccount });
    if (!senderAccount) {
      return res.status(404).json({ message: 'Sender account not found' });
    }
    if (senderAccount.AMOUNT < transferAmount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const recipientAccount = await accdata.findOne({ "A/C NO": toAccount });
    if (!recipientAccount) {
      return res.status(404).json({ message: 'Recipient account not found' });
    }

    console.log('Sender:', senderAccount);
    console.log('Recipient:', recipientAccount);

    // Update balances
    senderAccount.AMOUNT -= transferAmount;
    recipientAccount.AMOUNT += transferAmount;
    await senderAccount.save();
    await recipientAccount.save();

    // Create transaction records
    const withdrawal = new Transaction({
      accountNumber: fromAccount, type: 'withdrawal', amount: transferAmount,
      description: `Transfer to ${toAccount} (${recipientAccount.Name})`
    });
    await withdrawal.save();

    const deposit = new Transaction({
      accountNumber: toAccount, type: 'deposit', amount: transferAmount,
      description: `Transfer from ${fromAccount} (${senderAccount.Name})`
    });
    await deposit.save();

    res.json({
      message: `Successfully transferred ₹${transferAmount} to account ending in ${toAccount.slice(-4)}.`,
      updatedBalance: senderAccount.AMOUNT
    });
  } catch (error) {
    console.error('Transfer error:', error);
    res.status(500).json({ message: 'Error processing transfer', error: error.message });
  }
};

export const updateName = async (req, res) => {
  try {
    const { accountNumber, newName } = req.body;

    // Validate input
    if (!accountNumber || !newName) {
      return res.status(400).json({ message: 'Account number and new name are required' });
    }

    // Find account
    const accountData = await accdata.findOne({ "A/C NO": accountNumber });
    if (!accountData) {
      return res.status(404).json({ message: 'Account not found' });
    }

    // Update name
    const updatedAccount = await accdata.findOneAndUpdate(
      { "A/C NO": accountNumber },
      { $set: { "Name": newName } },
      { new: true }
    );

    if (!updatedAccount) {
      return res.status(500).json({ message: 'Failed to update name' });
    }

    res.json({
      message: 'Name updated successfully',
      fullname: newName,
      account: updatedAccount
    });

  } catch (error) {
    console.error('Update name error:', error);
    res.status(500).json({ message: 'Error updating name', error: error.message });
  }
}; 