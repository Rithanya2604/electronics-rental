const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  legacyId: { type: Number, unique: true, sparse: true },
  name: { type: String, required: true, trim: true },
  image: { type: String, required: true },
  desc: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  deposit: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, trim: true },
  stock: { type: Number, default: 5, min: 0 },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
