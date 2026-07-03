const asyncHandler = require('express-async-handler');
const Station = require('../models/Station');

// @desc    Get all stations (for search autocomplete)
// @route   GET /api/stations
// @access  Public
const getStations = asyncHandler(async (req, res) => {
  const stations = await Station.find().sort('name');
  res.json({ success: true, count: stations.length, data: stations });
});

module.exports = { getStations };
