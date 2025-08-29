import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  accountNumber: {
    type: String,
    required: true,
    ref: 'accdata'
  },
  type: {
    type: String,
    required: true,
    enum: ['deposit', 'withdrawal', 'transfer']
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction; 