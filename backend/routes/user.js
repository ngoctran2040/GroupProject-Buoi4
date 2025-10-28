const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

// --- Lấy thông tin cá nhân ---
router.get("/profile", auth, userController.getProfile);

// --- Cập nhật thông tin cá nhân ---
router.put("/profile", auth, userController.updateProfile);

// --- Upload ảnh đại diện ---
router.put("/profile/avatar", auth, upload.single("avatar"), userController.uploadAvatar);

module.exports = router; // ✅ Chỉ export route người dùng
