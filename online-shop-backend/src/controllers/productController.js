const Product = require('../models/Product');

// Obține toate produsele
const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Eroare la obținerea produselor' });
    }
};

// Obține un produs după ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Produsul nu a fost găsit' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Eroare la obținerea produsului' });
    }
};

// Creează un produs nou
const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, image, stock } = req.body;
        const product = await Product.create({ name, description, price, category, image, stock });
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Eroare la crearea produsului' });
    }
};

// Actualizează un produs
const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) return res.status(404).json({ message: 'Produsul nu a fost găsit' });
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Eroare la actualizarea produsului' });
    }
};

// Șterge un produs
const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ message: 'Produsul nu a fost găsit' });
        res.json({ message: 'Produs șters cu succes' });
    } catch (error) {
        res.status(500).json({ message: 'Eroare la ștergerea produsului' });
    }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
