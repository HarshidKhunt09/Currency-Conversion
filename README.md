# Currency Conversion API

## Purpose
This API provides a service for converting a specified amount from one currency to another using exchange rates fetched from the ExchangeRate-API.

## ⚙️ How to Run the Currency Conversion API

Follow these steps to set up and run the Currency Conversion API:

### 1. Clone the Repository
```
git clone https://github.com/HarshidKhunt09/Currency-Conversion.git
```

### 2. Navigate to the Backend Directory
```
cd backend
```

### 3. Install Dependencies
```
npm install
```

### 4. Set Up Environment Variables
Create a `.env` file in the root of the backend directory and define the following environment variables:

- **EXCHANGE_RATE_API_BASE_URL**: Base URL for the Exchange Rate API.
- **EXCHANGE_RATE_API_KEY**: Your API key for accessing the Exchange Rate API.

Example `.env` file:
```plaintext
EXCHANGE_RATE_API_BASE_URL=https://v6.exchangerate-api.com/v6
EXCHANGE_RATE_API_KEY=your_api_key_here
```

### 5. Start the Development Server
```
npm run dev
```

### 6. Make a Request Using Postman
Use Postman or any HTTP client to send a POST request to the following endpoint:

- **Request URL**:
  ```
  http://localhost:5000/api/currency/convert
  ```

- **Request Body**:
  ```json
  {
    "fromCurrency": "USD",
    "toCurrency": "INR",
    "amount": 100
  }
  ```

---

## 🛠️ API Overview
### Endpoint
**POST /api/currency/convert**

### Request Body Parameters
| Parameter      | Type   | Description                           |
|----------------|--------|---------------------------------------|
| `fromCurrency` | String | The currency code to convert from.    |
| `toCurrency`   | String | The currency code to convert to.      |
| `amount`       | Number | The amount to convert.                |

### Response Example
**Success (200)**:
```json
{
    "message": "Currency conversion successful",
    "data": {
        "fromCurrency": "USD",
        "toCurrency": "INR",
        "amount": 100,
        "convertedAmount": 8630.99,
        "conversionRate": 86.3099,
        "lastUpdated": "Sat, 25 Jan 2025 00:00:02 +0000",
        "nextUpdate": "Sun, 26 Jan 2025 00:00:02 +0000"
    }
}
```

**Error (400)**: Invalid input
```json
{
  "message": "Currency conversion failed. Please try again later.",
  "error": "Invalid input. Please provide 'fromCurrency', 'toCurrency', and a valid 'amount'."
}
```

**Error (404)**: Unsupported currency code
```json
{
  "message": "Currency conversion failed. Please try again later.",
  "error": "Unsupported currency code provided."
}
```

---

## 📝 Error Handling
The API handles various errors efficiently to ensure accurate and actionable responses.

| Error Type           | Status Code | Description                                                       |
|----------------------|-------------|-------------------------------------------------------------------|
| `BadRequestError`    | 400         | Invalid input or malformed request.                              |
| `NotFoundError`      | 404         | Unsupported currency code or API issue.                         |
| `UnauthorizedError`  | 401         | Invalid API key or inactive account.                            |
| `InternalServerError`| 500         | Quota reached, server error, or unknown issue during processing. |

### Common Scenarios and Messages
- **Invalid Input**: `"Invalid input. Please provide 'fromCurrency', 'toCurrency', and a valid 'amount'."`
- **Unsupported Currency Code**: `"Unsupported currency code provided."`
- **API Key Issues**: `"Invalid API key. Please verify your API key."`
- **Quota Exceeded**: `"API request quota reached. Please upgrade your plan."`

---

### Thank You
