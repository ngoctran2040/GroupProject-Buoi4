const express = require('express');
const router = express.Router();

// Import controller
const userController = require('../controllers/userController');

// Định nghĩa các route

// GET /users - Lấy danh sách user
router.get('/', userController.getUsers);

// POST /users - Tạo user mới
router.post('/', userController.createUser);

// Xuất router để server.js có thể dùng
module.exports = router;