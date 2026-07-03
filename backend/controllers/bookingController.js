const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking');
const Train = require('../models/Train');
const generatePNR = require('../utils/generatePNR');

const BERTHS = ['Lower', 'Middle', 'Upper', 'Side Lower', 'Side Upper'];

// @desc    Create a new booking (allocates seats or waitlists automatically)
// @route   POST /api/bookings
// @access  Private
const createBooking = asyncHandler(async (req, res) => {
  const { trainId, journeyDate, classType, passengers, contactEmail, contactPhone } = req.body;

  if (!trainId || !journeyDate || !classType || !passengers?.length) {
    res.status(400);
    throw new Error('Missing required booking details');
  }

  if (passengers.length > 6) {
    res.status(400);
    throw new Error('A maximum of 6 passengers can be booked at once');
  }

  const train = await Train.findById(trainId);
  if (!train) {
    res.status(404);
    throw new Error('Train not found');
  }

  const classInfo = train.classes.find((c) => c.type === classType);
  if (!classInfo) {
    res.status(400);
    throw new Error('Selected class is not available on this train');
  }

  const seatsNeeded = passengers.length;
  const isConfirmed = classInfo.availableSeats >= seatsNeeded;
  let finalPassengers = passengers;

  if (isConfirmed) {
    const startSeat = classInfo.totalSeats - classInfo.availableSeats + 1;
    finalPassengers = passengers.map((p, idx) => ({
      name: p.name,
      age: p.age,
      gender: p.gender,
      seatNumber: `${classType}-${startSeat + idx}`,
      berth: BERTHS[idx % BERTHS.length],
    }));

    await Train.updateOne(
      { _id: trainId, 'classes.type': classType },
      { $inc: { 'classes.$.availableSeats': -seatsNeeded } }
    );
  }

  const pnr = await generatePNR();
  const totalFare = classInfo.fare * seatsNeeded;

  const booking = await Booking.create({
    pnr,
    user: req.user._id,
    train: trainId,
    journeyDate,
    classType,
    passengers: finalPassengers,
    contactEmail,
    contactPhone,
    totalFare,
    paymentStatus: 'pending',
    bookingStatus: isConfirmed ? 'confirmed' : 'waitlisted',
  });

  res.status(201).json({ success: true, data: booking });
});

// @desc    Confirm payment for a booking (simulated payment gateway)
// @route   PUT /api/bookings/:id/pay
// @access  Private
const payForBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  if (booking.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this booking');
  }

  booking.paymentStatus = 'paid';
  await booking.save();

  res.json({ success: true, data: booking });
});

// @desc    Get bookings for the logged-in user
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('train', 'trainNumber trainName source destination departureTime arrivalTime')
    .sort('-createdAt');

  res.json({ success: true, count: bookings.length, data: bookings });
});

// @desc    Look up a booking by its PNR (public, like real IRCTC PNR check)
// @route   GET /api/bookings/pnr/:pnr
// @access  Public
const getBookingByPNR = asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({ pnr: req.params.pnr }).populate(
    'train',
    'trainNumber trainName source destination departureTime arrivalTime duration'
  );

  if (!booking) {
    res.status(404);
    throw new Error('No booking found for this PNR');
  }

  res.json({ success: true, data: booking });
});

// @desc    Cancel a booking and release its seats back to inventory
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  if (booking.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to cancel this booking');
  }

  if (booking.bookingStatus === 'cancelled') {
    res.status(400);
    throw new Error('Booking is already cancelled');
  }

  if (booking.bookingStatus === 'confirmed') {
    await Train.updateOne(
      { _id: booking.train, 'classes.type': booking.classType },
      { $inc: { 'classes.$.availableSeats': booking.passengers.length } }
    );
  }

  booking.bookingStatus = 'cancelled';
  await booking.save();

  res.json({ success: true, data: booking });
});

module.exports = {
  createBooking,
  payForBooking,
  getMyBookings,
  getBookingByPNR,
  cancelBooking,
};
