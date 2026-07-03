const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  name: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
});

stationSchema.index({ name: 'text', city: 'text', code: 'text' });

module.exports = mongoose.model('Station', stationSchema);
