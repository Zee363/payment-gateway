const request = require('supertest');
const express = require('express');
const paymentController = require('../controllers/paymentController');
const paystackService = require('../service/paystackService');

jest.mock('../service/paystackService'); // Auto-mock the service

const app = express();
app.use(express.json());
app.post('/api/v1/payments', paymentController.createPayment);
app.get('/api/v1/payments/:reference', paymentController.getPaymentByReference);

describe('Payment Controller', () => {
  describe('POST /api/v1/payments', () => {
    it('should initialize payment successfully', async () => {
      // Mock Paystack response
      paystackService.initializePayment.mockResolvedValue({
        data: {
          reference: 'ref123',
          authorization_url: 'https://paystack.com/pay/ref123',
          access_code: 'code123'
        }
      });

      const res = await request(app)
        .post('/api/v1/payments')
        .send({ email: 'johndoe@gmail.com', amount: 5000 });

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual(expect.objectContaining({
        message: 'Payment initialized successfully',
        reference: 'ref123',
        authorization_url: 'https://paystack.com/pay/ref123',
        access_code: 'code123',
      }));
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/v1/payments')
        .send({ email: '' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message', 'Email and amount are required');
    });

    it('should return 500 if paystackService fails', async () => {
      paystackService.initializePayment.mockRejectedValue(new Error('Something went wrong'));

      const res = await request(app)
        .post('/api/v1/payments')
        .send({ email: 'johndoe@gmail.com', amount: 5000 });

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty('message', 'Payment creation failed');
    });
  });

  describe('GET /api/v1/payments/:reference', () => {
    it('should verify payment by reference', async () => {
      paystackService.verifyPayment.mockResolvedValue({
        data: {
          status: 'success',
          reference: 'ref123',
          amount: 5000
        }
      });

      const res = await request(app).get('/api/v1/payments/ref123');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(expect.objectContaining({
        message: 'Payment fetched successfully',
        paystack: {
          status: 'success',
          reference: 'ref123',
          amount: 5000
        }
      }));
    });

    it('should return 500 if Paystack verify fails', async () => {
      paystackService.verifyPayment.mockRejectedValue(new Error('Verification failed'));

      const res = await request(app).get('/api/v1/payments/ref123');

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty('error', 'Verification failed');
    });
  });
});
