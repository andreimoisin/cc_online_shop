const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const EmailService = require('../services/ServiceEmail');

// Plasează o comandă
const placeOrder = async (req, res) => {
    try {
        const userId = req.user.id; // Preluăm userId din token

        // Obține coșul utilizatorului
        const cart = await Cart.findOne({ userId }).populate('products.productId');
        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ message: 'Coșul este gol' });
        }

        // Calculează totalul comenzii
        let total = 0;
        cart.products.forEach(item => {
            total += item.productId.price * item.quantity;
        });

        // Creează comanda
        const order = await Order.create({
            userId,
            products: cart.products,
            total,
            status: 'pending'
        });

        // Golește coșul după plasarea comenzii
        cart.products = [];
        await cart.save();

  // Trimite email de confirmare către utilizator
  try {
    console.log("Utilizator extras din token:", req.user);
    await EmailService.sendEmail(
        req.user.email, // Adresa destinatarului; asigură-te că req.user.email este disponibil
        'Confirmare Comandă',
        `Comanda cu ID-ul ${order._id} a fost plasată cu succes. Mulțumim pentru achiziție!`,
        `<p>Comanda cu ID-ul <strong>${order._id}</strong> a fost plasată cu succes. Mulțumim pentru achiziție!</p>`
    );
} catch (emailError) {
    console.error('Eroare la trimiterea emailului de confirmare:', emailError);
    // Poți alege să continui, chiar dacă trimiterea emailului eșuează
}

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Eroare la plasarea comenzii' });
    }
};


// Obține comenzile unui utilizator
const getUserOrders = async (req, res) => {
    try {

        const userId = req.user.id; // Preluăm userId din token
        const orders = await Order.find({ userId: userId }).populate('products.productId');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Eroare la obținerea comenzilor utilizatorului' });
    }
};

// Obține toate comenzile (ADMIN)
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('userId', 'name email')
            .populate('products.productId')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Eroare la obținerea tuturor comenzilor' });
    }
};

// Actualizează statusul unei comenzi (ADMIN)
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });

        if (!order) return res.status(404).json({ message: 'Comanda nu a fost găsită' });

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Eroare la actualizarea statusului comenzii' });
    }
};

module.exports = { placeOrder, getUserOrders, getAllOrders, updateOrderStatus };
