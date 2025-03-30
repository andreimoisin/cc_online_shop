const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Înregistrare utilizator
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Verifică dacă utilizatorul există deja
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'Utilizatorul există deja' });

        // Hash-uirea parolei
        const hashedPassword = await bcrypt.hash(password, 10);

        // Creează utilizatorul
        const user = await User.create({ name, email, password: hashedPassword, role });

        res.status(201).json({ message: 'Utilizator creat cu succes' });
    } catch (error) {
        res.status(500).json({ message: 'Eroare la înregistrare' });
    }
};

// Autentificare utilizator
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(401).json({ message: 'Email sau parolă incorectă' });

        // Compară parola introdusă cu hash-ul stocat
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Email sau parolă incorectă' });

        // Generează token JWT
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: 'Eroare la autentificare' });
    }
};

module.exports = { register, login };
