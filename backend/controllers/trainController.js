const asyncHandler = require('express-async-handler');
const Train = require('../models/Train');

// @desc    Search trains between two stations
// @route   GET /api/trains/search?from=CODE&to=CODE&date=YYYY-MM-DD
// @access  Public
const searchTrains = asyncHandler(async (req, res) => {
  const { from, to } = req.query;

  if (!from || !to) {
    res.status(400);
    throw new Error('Please provide both source and destination stations');
  }

  const trains = await Train.find({
    'source.code': from.toUpperCase(),
    'destination.code': to.toUpperCase(),
  }).sort('departureTime');

  res.json({ success: true, count: trains.length, data: trains });
});

// @desc    Get a single train by id
// @route   GET /api/trains/:id
// @access  Public
const getTrainById = asyncHandler(async (req, res) => {
  const train = await Train.findById(req.params.id);

  if (!train) {
    res.status(404);
    throw new Error('Train not found');
  }

  res.json({ success: true, data: train });
});

module.exports = { searchTrains, getTrainById };
