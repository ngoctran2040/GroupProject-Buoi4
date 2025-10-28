const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// --- Đăng ký ---
router.post('/signup', authController.signup);

// --- Đăng nhập ---
router.post('/login', authController.login);

// --- Quên mật khẩu ---
router.post('/forgot-password', authController.forgotPassword);

// --- Đặt lại mật khẩu ---
router.post('/reset-password/:token', authController.resetPassword);

module.exports = router;
