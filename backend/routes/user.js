// backend/routes/user.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// ĐÚNG: router.get('/', ...) vì server.js đã xử lý '/users'
router.get('/', userController.getUsers);

// ĐÚNG: router.post('/', ...)
router.post('/', userController.createUser);

module.exports = router;