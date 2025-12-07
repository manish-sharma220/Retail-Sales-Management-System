import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema({
  customerId: {
    type: String,
    required: true,
    trim: true
  },
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other']
  },
  age: {
    type: Number,
    required: true,
    min: 0
  },
  customerRegion: {
    type: String,
    required: true
  },
  customerType: {
    type: String,
    required: true
  },
  productId: {
    type: String,
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  productCategory: {
    type: String,
    required: true
  },
  tags: {
    type: [String],
    default: []
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  pricePerUnit: {
    type: Number,
    required: true,
    min: 0
  },
  discountPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  totalAmount: {
    type: Number,
    required: true
  },
  finalAmount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  paymentMethod: {
    type: String,
    required: true
  },
  orderStatus: {
    type: String,
    required: true
  },
  deliveryType: {
    type: String,
    required: true
  },
  storeId: {
    type: String,
    required: true
  },
  storeLocation: {
    type: String,
    required: true
  },
  salespersonId: {
    type: String,
    required: true
  },
  employeeName: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

saleSchema.index({ customerName: 1, phoneNumber: 1 });
saleSchema.index({ date: -1 });
saleSchema.index({ customerRegion: 1 });
saleSchema.index({ productCategory: 1 });
saleSchema.index({ tags: 1 });

export default mongoose.model('Sale', saleSchema);
