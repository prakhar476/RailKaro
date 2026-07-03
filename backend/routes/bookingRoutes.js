const express = require('express');
const router = express.Router();
const {
  createBooking,
  payForBooking,
  getMyBookings,
  getBookingByPNR,
  cancelBooking,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/pnr/:pnr', getBookingByPNR);
router.put('/:id/pay', protect, payForBooking);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;
