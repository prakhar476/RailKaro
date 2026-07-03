const mongoose = require('mongoose');

const passengerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true, min: 1, max: 120 },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    seatNumber: { type: String, default: null },
    berth: { type: String, default: null },
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    pnr: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    train: { type: mongoose.Schema.Types.ObjectId, ref: 'Train', required: true },
    journeyDate: { type: Date, required: true },
    classType: { type: String, required: true },
    passengers: {
      type: [passengerSchema],
      required: true,
      validate: (v) => Array.isArray(v) && v.length > 0 && v.length <= 6,
    },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: true },
    totalFare: { type: Number, required: true, min: 0 },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    bookingStatus: {
      type: String,
      enum: ['confirmed', 'waitlisted', 'cancelled'],
      default: 'waitlisted',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
