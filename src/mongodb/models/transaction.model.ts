import mongoose, { Schema } from 'mongoose';
import { AppConfig } from '../../utilities/config';


const TransactionSchema = new mongoose.Schema({
  status: { type: String, required: true },
  paidAt: { type: Date, required: false },
  amount: { type: Number, required: true },
  reference: { type: String, required: true },
  apiId: { type: String, required: false },
  description: { type: String, required: true, enum: Object.values(AppConfig.TRANSACTION_DESC_TYPES) },
  txnType: { type: String, required: true, enum: Object.values(AppConfig.TRANSACTION_TYPES) },
  source: { type: String, required: false },
  destination: { type: String, required: false },
  subscription: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: 'Subscription',
    autopopulate: true
  },
  account: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: 'Account',
  },
}, {
  toJSON: {
    transform: (_, rec) => {
      const { __v, _id, ...object } = rec;
      object.id = _id
      return object;
    }
  }
});

TransactionSchema.plugin(require('mongoose-autopopulate'));
const TransactionModel = mongoose.model('Transaction', TransactionSchema);

export default TransactionModel;