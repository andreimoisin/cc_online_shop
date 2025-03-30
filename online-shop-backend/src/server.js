require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware-uri
app.use(cors());
app.use(express.json());

// Conectare la MongoDB
connectDB();

// Test route
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.get('/ping', (req, res) => {
    res.json({ message: 'pong from backend' });
}); 

// Products route
app.use('/products', productRoutes);

// Cart route
app.use('/cart', cartRoutes);

// Order route
app.use('/orders', orderRoutes);

// Auth route
app.use('/auth', authRoutes);

// User route
app.use('/users', userRoutes);

// Pornirea serverului
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

