const mongoose = require('mongoose');

const classSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['SL', '3A', '2A', '1A', 'CC'],
      required: true,
    },
    label: { type: String, required: true },
    fare: { type: Number, required: true, min: 0 },
    totalSeats: { type: Number, required: true, min: 0 },
    availableSeats: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const trainSchema = new mongoose.Schema(
  {
    trainNumber: { type: String, required: true, unique: true, trim: true },
    trainName: { type: String, required: true, trim: true },
    source: {
      code: { type: String, required: true, uppercase: true },
      name: { type: String, required: true },
    },
    destination: {
      code: { type: String, required: true, uppercase: true },
      name: { type: String, required: true },
    },
    departureTime: { type: String, required: true },
    arrivalTime: { type: String, required: true },
    duration: { type: String, required: true },
    distance: { type: Number, required: true, min: 0 },
    runsOn: {
      type: [String],
      default: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    classes: {
      type: [classSchema],
      required: true,
      validate: (v) => Array.isArray(v) && v.length > 0,
    },
    rating: { type: Number, default: 4.2, min: 0, max: 5 },
  },
  { timestamps: true }
);

trainSchema.index({ 'source.code': 1, 'destination.code': 1 });

module.exports = mongoose.model('Train', trainSchema);
