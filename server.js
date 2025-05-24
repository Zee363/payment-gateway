require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const paymentRoutes = require('./routes/paymentRoutes');

const PORT = process.env.PORT || 5000;

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 50, 
    message: 'Too many requests from this IP, please try again later.',
});

app.use(cors())
app.use(express.json());
app.use(limiter);
app.use('/api/v1/payments', paymentRoutes);
app.get('/api/v1/payments/:reference', paymentRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

module.exports = app;
