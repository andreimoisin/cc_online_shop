const express = require('express');
const { addToCart, getCart, updateCartItem, removeFromCart, clearCart } = require('../controllers/cartController');
const { protect, adminCheck } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/add', protect, addToCart);
router.get('/', protect, getCart);
router.put('/update', protect, updateCartItem);
router.post('/remove', protect, removeFromCart);
router.post('/clear', protect, clearCart);


module.exports = router;
