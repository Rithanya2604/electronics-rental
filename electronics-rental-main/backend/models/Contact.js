const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  subject: { type: String, default: '' },
  message: { type: String, required: true, trim: true },
  status: { type: String, enum: ['New','Read','Resolved'], default: 'New' }
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
