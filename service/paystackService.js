require('dotenv').config();
const axios = require('axios');

exports.initializePayment = async (data) => {
const { email, amount } = data;

 if (!process.env.TEST_SECRET_KEY) {
    throw new Error('Missing Paystack secret key in environment variables');
  }

try {
    const response = await axios.post('https://api.paystack.co/transaction/initialize', {
        email, amount,
    }, 
    {
        headers: {
            Authorization: `Bearer ${process.env.TEST_SECRET_KEY}`,
            'Content-Type': 'application/json',
        },
    });

    return response.data;
} catch (error) {
    console.error('Error creating payment:', error.response ? error.response.data : error.message);
    throw new Error('Payment creation failed');
}
};


exports.verifyPayment = async (reference) => {
  try {
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.TEST_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching payment:', error.response?.data || error.message);
    throw new Error('Payment retrieval failed');
  }
};