const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Adaugă un produs în coș
const addToCart = async (req, res) => {
    try {
        const userId = req.user.id; // Preluăm userId din token
        const { productId, quantity } = req.body;

        // Verifică dacă produsul există
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Produsul nu există' });

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, products: [] });
        }

        // Verifică dacă produsul este deja în coș
        const existingProduct = cart.products.find(p => p.productId.toString() === productId);
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ productId, quantity });
        }

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Eroare la adăugarea în coș' });
    }
};


// Obține coșul unui utilizator
const getCart = async (req, res) => {
    try {
        const userId = req.user.id; // Preluăm userId din token
        const cart = await Cart.findOne({ userId }).populate('products.productId');
        if (!cart) return res.json({ message: 'Coșul este gol' });

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Eroare la obținerea coșului' });
    }
};

// Actualizează cantitatea unui produs în coș
const updateCartItem = async (req, res) => {
    try {
        const userId = req.user.id; // Preluăm userId din token
        const { productId, quantity } = req.body;
        const cart = await Cart.findOne({ userId });

        if (!cart) return res.status(404).json({ message: 'Coșul nu a fost găsit' });

        const item = cart.products.find(p => p.productId.toString() === productId);
        if (!item) return res.status(404).json({ message: 'Produsul nu este în coș' });

        item.quantity = quantity;
        await cart.save();

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Eroare la actualizarea produsului în coș' });
    }
};

// Șterge un produs din coș
const removeFromCart = async (req, res) => {
    try {
        const userId = req.user.id; // Preluăm userId din token
        const { productId } = req.body;
        const cart = await Cart.findOne({ userId });

        if (!cart) return res.status(404).json({ message: 'Coșul nu a fost găsit' });

        cart.products = cart.products.filter(p => p.productId.toString() !== productId);
        await cart.save();

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Eroare la eliminarea produsului din coș' });
    }
};

// Golește întregul coș
const clearCart = async (req, res) => {
    try {
        const userId = req.user.id; // Preluăm userId din token
        const cart = await Cart.findOne({ userId });

        if (!cart) return res.status(404).json({ message: 'Coșul nu a fost găsit' });

        cart.products = [];
        await cart.save();

        res.json({ message: 'Coș golit cu succes' });
    } catch (error) {
        res.status(500).json({ message: 'Eroare la golirea coșului' });
    }
};

module.exports = { addToCart, getCart, updateCartItem, removeFromCart, clearCart };
