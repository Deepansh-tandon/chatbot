import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  paymentId: {
    type: String,
    unique: true,
    default: () => `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  },
  orderId: {
    type: String,
    required: true,
    ref: 'Order'
  },
  amountPaid: {
    type: Number,
    required: true,
    min: 0
  },
  pendingAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'partial', 'completed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;


