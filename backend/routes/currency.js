const express = require('express');
const router = express.Router();

const CurrencyController = require('../controllers/CurrencyController');

// Route to convert currency
router.post('/convert', CurrencyController.convertCurrency);

module.exports = router;
