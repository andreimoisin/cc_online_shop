const User = require('../models/User');

// Obține toți utilizatorii (Admin only)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Excludem parola
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Eroare la obținerea utilizatorilor' });
    }
};

// Obține un utilizator după ID (Admin only)
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'Utilizatorul nu a fost găsit' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Eroare la obținerea utilizatorului' });
    }
};

// Actualizează profilul utilizatorului (Self update)
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ message: 'Utilizatorul nu a fost găsit' });

        user.name = req.body.name || user.name;
        if (req.body.password) {
            user.password = req.body.password;
        }

        await user.save();
        res.json({ message: 'Profil actualizat cu succes' });
    } catch (error) {
        res.status(500).json({ message: 'Eroare la actualizarea profilului' });
    }
};

// Șterge un utilizator (Admin only)
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'Utilizatorul nu a fost găsit' });

        await user.deleteOne();
        res.json({ message: 'Utilizator șters cu succes' });
    } catch (error) {
        res.status(500).json({ message: 'Eroare la ștergerea utilizatorului' });
    }
};

module.exports = { getAllUsers, getUserById, updateUserProfile, deleteUser };
