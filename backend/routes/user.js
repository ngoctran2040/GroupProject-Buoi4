const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Lấy danh sách user (GET)
router.get('/users', userController.getUsers);

// Thêm user mới (POST)
router.post('/users', userController.createUser);

module.exports = router;
