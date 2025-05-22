const express = require('express');
const router = express.Router();
const {
    register,
    login,
    getMe,
    logout,
    forgotPassword,
    resetPassword,
    updatePassword,
    verifyEmail
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const {
    registerValidation,
    loginValidation,
    forgotPasswordValidation,
    resetPasswordValidation,
    updatePasswordValidation
} = require('../middleware/validator');

// Register and login routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/logout', logout);

// User profile route
router.get('/me', protect, getMe);

// Email verification route
router.get('/verify-email/:token', verifyEmail);

// Password management routes
router.post('/forgot-password', forgotPasswordValidation, forgotPassword);
router.put('/reset-password/:token', resetPasswordValidation, resetPassword);
router.put('/update-password', protect, updatePasswordValidation, updatePassword);

module.exports = router;
