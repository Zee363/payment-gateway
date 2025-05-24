require('dotenv').config();
const express = require('express');
const app = express();
const paymentRoutes = require('./routes/paymentRoutes');

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use('/api/v1/payments', paymentRoutes);
app.get('/api/v1/payments/{reference}', paymentRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

