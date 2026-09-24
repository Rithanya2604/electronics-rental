const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  reference: { type: String, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: String,
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true },
  phone: { type: String, required: true },
  start: { type: Date, required: true },
  duration: { type: String, required: true },
  address: { type: String, required: true },
  rentalPrice: Number,
  securityDeposit: Number,
  status: { type: String, enum: ['Pending','Confirmed','Active','Completed','Cancelled'], default: 'Confirmed' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
