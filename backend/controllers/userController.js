// --- Import User Model đã được tạo ở models/User.js ---
const User = require('../models/User');

// --- GET /users - Lấy tất cả user từ MongoDB ---
const getUsers = async (req, res) => {
  try {
    // Dùng User model và hàm find() để lấy tất cả document trong collection 'users'
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    // Nếu có lỗi, trả về status 500 (Internal Server Error)
    res.status(500).json({ message: "Đã có lỗi xảy ra trên server", error: error.message });
  }
};

// --- POST /users - Tạo một user mới và lưu vào MongoDB ---
const createUser = async (req, res) => {
  // Lấy name và email từ body của request
  const { name, email } = req.body;

  // Kiểm tra xem name và email có được cung cấp không
  if (!name || !email) {
    return res.status(400).json({ message: "Vui lòng cung cấp đủ tên và email." });
  }

  // Tạo một đối tượng user mới dựa trên Model
  const newUser = new User({
    name,
    email
  });

  try {
    // Dùng hàm save() để lưu user mới vào database
    const savedUser = await newUser.save();
    // Trả về user vừa được tạo với status 201 (Created)
    res.status(201).json(savedUser);
  } catch (error) {
    // Nếu có lỗi (ví dụ: email bị trùng), trả về status 400 (Bad Request)
    res.status(400).json({ message: "Không thể tạo user", error: error.message });
  }
};

// --- Xuất các hàm để file route có thể sử dụng ---
module.exports = {
  getUsers,
  createUser
};