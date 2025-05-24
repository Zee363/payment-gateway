const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/', paymentController.createPayment);
router.get('/:reference', paymentController.getPaymentByReference);

module.exports = router;