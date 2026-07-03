const Booking = require('../models/Booking');

/**
 * Generates a unique 10-digit PNR number, re-rolling on the rare
 * collision so every booking gets a guaranteed-unique reference.
 */
const generatePNR = async () => {
  let pnr;
  let exists = true;

  while (exists) {
    pnr = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    exists = await Booking.exists({ pnr });
  }

  return pnr;
};

module.exports = generatePNR;
