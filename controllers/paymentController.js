require('dotenv').config();
const paystackService = require('../service/paystackService');

exports.createPayment = async (req, res) => {
    const { email, amount } = req.body;
    

    if (!email || !amount) {
        return res.status(400).json({ message: 'Email and amount are required' });
    }

try {
    const paystackResponse = await paystackService.initializePayment({ email, amount });

    res.status(201).json({
      message: 'Payment initialized successfully',
      reference: paystackResponse.data.reference,
      authorization_url: paystackResponse.data.authorization_url,
      access_code: paystackResponse.data.access_code,
    });
} catch (error) {
    console.error('Error creating payment:', error.message);
    res.status(500).json({ message: 'Payment creation failed', error: error.message });
 }
};

exports.getPaymentByReference = async (req, res) => {
  const { reference } = req.params;

  try {
    const result = await paystackService.verifyPayment(reference);
    res.status(200).json({
      message: 'Payment fetched successfully',
      paystack: result.data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};