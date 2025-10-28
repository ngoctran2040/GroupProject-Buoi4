<<<<<<< Updated upstream
// backend/controllers/userController.js

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
  // Thêm dòng console.log để kiểm tra dữ liệu nhận được
  console.log('Backend đã nhận được body để tạo user:', req.body); 
  
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
=======
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");
const { cloudinary } = require("../config/cloudinary"); // ✅ Import đúng từ config

// --- AUTH (Hoạt động 1) ---
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email đã tồn tại" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });
    res.status(201).json({ message: "Đăng ký thành công", user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email không tồn tại" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Sai mật khẩu" });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Đăng nhập thành công", token, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.logout = (req, res) => {
  res.json({ message: "Đăng xuất thành công (xóa token ở client)" });
};

// --- USER PROFILE (Hoạt động 2) ---
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  const { name, email } = req.body;
  try {
    let user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== req.user.id) {
        return res.status(400).json({ message: "Email này đã được sử dụng" });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { name, email } },
      { new: true }
    ).select("-password");

    res.json({ message: "Cập nhật thông tin thành công", user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- ADMIN (Hoạt động 3) ---
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

    if (user.avatar && user.avatar.public_id) {
      await cloudinary.uploader.destroy(user.avatar.public_id);
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Xóa người dùng thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- ADVANCED (Hoạt động 4) ---
// 4.1. Quên mật khẩu
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: "Không tìm thấy email" });

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    const resetUrl = `${req.protocol}://localhost:3001/reset-password/${resetToken}`;
    const message = `Bạn nhận được email này vì bạn (hoặc ai đó) đã yêu cầu đặt lại mật khẩu.\n\n${resetUrl}\n\nNếu không phải bạn yêu cầu, vui lòng bỏ qua email này.`;

    await sendEmail({
      email: user.email,
      subject: "Yêu cầu đặt lại mật khẩu",
      message,
    });

    res.status(200).json({ message: "Đã gửi email đặt lại mật khẩu" });
  } catch (err) {
    console.error("LỖI forgotPassword:", err);
    res.status(500).json({ error: "Lỗi khi gửi email" });
  }
};

// 4.2. Đặt lại mật khẩu
exports.resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user)
      return res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn" });

    user.password = await bcrypt.hash(req.body.password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ message: "Đổi mật khẩu thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4.3. Upload Avatar (Chuẩn mới nhất)
exports.uploadAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

    if (!req.file) {
      return res.status(400).json({ message: "Vui lòng đính kèm file với field 'avatar'" });
    }

    // Xóa avatar cũ nếu có
    if (user.avatar && user.avatar.public_id) {
      await cloudinary.uploader.destroy(user.avatar.public_id);
    }

    // Upload ảnh mới lên Cloudinary (dạng buffer)
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "avatars" },
        (err, uploaded) => (err ? reject(err) : resolve(uploaded))
      );
      stream.end(req.file.buffer);
    });

    user.avatar = {
      public_id: result.public_id,
      url: result.secure_url,
    };
    await user.save();

    res.json({
      message: "Upload avatar thành công!",
      avatarUrl: user.avatar.url,
    });
  } catch (err) {
    console.error("Lỗi khi upload avatar:", err);
    res.status(500).json({ error: err.message || "Lỗi server khi upload ảnh" });
>>>>>>> Stashed changes
  }
};

// --- Xuất các hàm để file route có thể sử dụng ---
module.exports = {
  getUsers,
  createUser
};