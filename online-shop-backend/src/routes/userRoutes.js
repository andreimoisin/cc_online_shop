const express = require('express');
const { getAllUsers, getUserById, updateUserProfile, deleteUser } = require('../controllers/userController');
const { protect, adminCheck } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, adminCheck, getAllUsers); // Doar adminii pot vedea toți utilizatorii
router.get('/:id', protect, adminCheck, getUserById); // Doar adminii pot vedea un utilizator specific
router.put('/profile', protect, updateUserProfile); // Utilizatorii își pot actualiza propriul profil
router.delete('/:id', protect, adminCheck, deleteUser); // Doar adminii pot șterge un utilizator

module.exports = router;
