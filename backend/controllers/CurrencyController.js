const { convertCurrency } = require('../services/CurrencyServices');

exports.convertCurrency = async (req, res) => {
  try {
    const { fromCurrency, toCurrency, amount } = req.body;

    const conversionResult = await convertCurrency(
      fromCurrency,
      toCurrency,
      amount
    );

    return res.status(200).json({
      message: 'Currency conversion successful',
      data: conversionResult,
    });
  } catch (error) {
    console.error('Error in CurrencyController:', error.message);
    return res.status(500).json({
      message: 'Currency conversion failed. Please try again later.',
      error: error.message,
    });
  }
};
