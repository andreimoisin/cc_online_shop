const express = require('express');
const { placeOrder, getUserOrders, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, adminCheck } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, placeOrder);
router.get('/', protect, getUserOrders);
router.get('/all', protect, adminCheck, getAllOrders);
router.put('/:id', protect, adminCheck, updateOrderStatus);


module.exports = router;
