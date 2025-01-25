/**
 * Currency Conversion Service
 *
 * This module handles the currency conversion logic using the ExchangeRate-API Pair Endpoint.
 * It fetches the conversion rate and calculates the converted amount if required.
 *
 * Functions:
 *
 * 1. convertCurrency(fromCurrency, toCurrency, amount)
 *    - Converts the given amount from one currency to another.
 *    - Fetches conversion rates from the ExchangeRate-API.
 *    - Throws BadRequestError for invalid inputs.
 *    - Throws NotFoundError for invalid or unsupported currency codes.
 *    - Throws UnauthorizedError for API key or account-related issues.
 *    - Throws InternalServerError for unknown or server-side errors.
 *    - Returns an object with conversion details including rate, converted amount, and timestamps.
 *
 * Errors:
 *
 * - BadRequestError: Thrown for invalid input or malformed requests.
 * - NotFoundError: Thrown when unsupported currency codes are provided.
 * - UnauthorizedError: Thrown for invalid API key or inactive account issues.
 * - InternalServerError: Thrown for unknown errors or quota-related issues.
 *
 * Example Usage:
 *
 * const currencyService = require('./currencyService');
 *
 * // Convert currency
 * currencyService.convertCurrency('USD', 'EUR', 100)
 *   .then(result => console.log(result))
 *   .catch(err => console.error(err));
 */

const axios = require('axios');
const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  InternalServerError,
} = require('../utils/errors');

const BASE_URL = process.env.EXCHANGE_RATE_API_BASE_URL;

/**
 * Converts the given amount from one currency to another.
 *
 * @param {string} fromCurrency - The currency code to convert from (e.g., USD).
 * @param {string} toCurrency - The currency code to convert to (e.g., EUR).
 * @param {number} amount - The amount to convert.
 * @returns {Object} - An object containing conversion details.
 */
exports.convertCurrency = async (fromCurrency, toCurrency, amount) => {
  if (!fromCurrency || !toCurrency || !amount || isNaN(amount)) {
    throw new BadRequestError(
      "Invalid input. Please provide 'fromCurrency', 'toCurrency', and a valid 'amount'."
    );
  }

  try {
    const apiKey = process.env.EXCHANGE_RATE_API_KEY;

    const apiUrl = `${BASE_URL}/${apiKey}/pair/${fromCurrency.toUpperCase()}/${toCurrency.toUpperCase()}/${amount}`;

    const response = await axios.get(apiUrl);

    const {
      result,
      base_code: baseCode,
      target_code: targetCode,
      conversion_rate: conversionRate,
      conversion_result: conversionResult,
    } = response.data;

    if (result !== 'success') {
      throw new NotFoundError(
        'Currency conversion failed. Please check the currency codes or API usage.'
      );
    }

    return {
      fromCurrency: baseCode,
      toCurrency: targetCode,
      amount: parseFloat(amount),
      convertedAmount: parseFloat(conversionResult.toFixed(2)),
      conversionRate: conversionRate,
      lastUpdated: response.data.time_last_update_utc,
      nextUpdate: response.data.time_next_update_utc,
    };
  } catch (error) {
    if (
      error.response &&
      error.response.data &&
      error.response.data['error-type']
    ) {
      const errorType = error.response.data['error-type'];
      switch (errorType) {
        case 'unsupported-code':
          throw new NotFoundError('Unsupported currency code provided.');
        case 'malformed-request':
          throw new BadRequestError(
            'Malformed request. Please check the request structure.'
          );
        case 'invalid-key':
          throw new UnauthorizedError(
            'Invalid API key. Please verify your API key.'
          );
        case 'inactive-account':
          throw new UnauthorizedError(
            'Inactive account. Please confirm your email address.'
          );
        case 'quota-reached':
          throw new InternalServerError(
            'API request quota reached. Please upgrade your plan.'
          );
        default:
          throw new InternalServerError(
            'Unknown error occurred while processing the request.'
          );
      }
    }

    console.error('Error during currency conversion:', error.message);
    throw new InternalServerError(
      'Currency conversion failed. Please try again.'
    );
  }
};
