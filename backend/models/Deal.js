import mongoose from 'mongoose';

const dealSchema = new mongoose.Schema({
  dealId: {
    type: String,
    unique: true,
    default: () => `DEAL_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0,
    default: null
  },
  discount: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  category: {
    type: String,
    trim: true,
    lowercase: true,
    default: 'general'
  },
  source: {
    type: String,
    trim: true,
    default: 'Store'
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  link: {
    type: String,
    default: ''
  },
  imageURL: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

dealSchema.index({ category: 1, price: 1 });
dealSchema.index({ isActive: 1, createdAt: -1 });

const Deal = mongoose.model('Deal', dealSchema);

export default Deal;
