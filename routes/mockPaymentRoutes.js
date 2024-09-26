const express = require("express");
const router = express.Router();

// Mock payment processing route
router.post("/success", (req, res) => {
  const { amount, currency } = req.body;

  // Simulate a successful payment response
  const mockResponse = {
    status: "success",
    transaction_id: "txn_" + Math.floor(Math.random() * 1000000),
    amount: amount,
    currency: currency,
    message: "Payment processed successfully.",
  };

  res.status(200).json(mockResponse);
});

// Simulate a payment failure route
router.post("/failure", (req, res) => {
  const { amount, currency } = req.body;

  const mockResponse = {
    status: "failure",
    transaction_id: null,
    amount: amount,
    currency: currency,
    message: "Payment failed due to insufficient funds.",
  };

  res.status(400).json(mockResponse);
});

module.exports = router;
