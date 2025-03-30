const express = require('express');
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, adminCheck } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', protect, adminCheck, createProduct);
router.put('/:id', protect, adminCheck, updateProduct);
router.delete('/:id', protect, adminCheck, deleteProduct);

module.exports = router;