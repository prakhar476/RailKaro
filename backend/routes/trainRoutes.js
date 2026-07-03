const express = require('express');
const router = express.Router();
const { searchTrains, getTrainById } = require('../controllers/trainController');

router.get('/search', searchTrains);
router.get('/:id', getTrainById);

module.exports = router;
