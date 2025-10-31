import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['Deposit', 'Withdrawal'], required: true },
  amount: { type: Number, required: true },
  reference: { type: String },
  meta: { type: Object, default: {} },
}, { timestamps: true });

export default mongoose.model('Transaction', TransactionSchema);
