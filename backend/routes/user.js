// backend/routes/user.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { upload } = require('../config/cloudinary'); // 👈 CHỈ LẤY upload

<<<<<<< Updated upstream
// ĐÚNG: router.get('/', ...) vì server.js đã xử lý '/users'
router.get('/', userController.getUsers);

// ĐÚNG: router.post('/', ...)
router.post('/', userController.createUser);
=======
// AUTH
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

// USER PROFILE
router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);

// ADMIN
router.get('/', auth, admin, userController.getUsers);
router.delete('/:id', auth, admin, userController.deleteUser);
router.post('/', auth, admin, userController.createUser);

// ADVANCED
router.post('/forgot-password', userController.forgotPassword);
router.put('/reset-password/:token', userController.resetPassword);

// Upload Avatar
router.put('/profile/avatar', auth, upload.single('avatar'), userController.uploadAvatar);
>>>>>>> Stashed changes

module.exports = router;