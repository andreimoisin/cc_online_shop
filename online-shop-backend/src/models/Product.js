const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String }, // Poate fi URL (AWS S3) sau local
    stock: { type: Number, default: 0 }
});

module.exports = mongoose.model('Product', ProductSchema);