const jwt = require('jsonwebtoken');

// Middleware pentru verificarea autentificării
const protect = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Acces neautorizat' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token invalid' });
    }
};

// Middleware pentru verificarea rolului de admin
const adminCheck = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acces interzis. Necesită rol de admin.' });
    }
    next();
};

module.exports = { protect, adminCheck };
