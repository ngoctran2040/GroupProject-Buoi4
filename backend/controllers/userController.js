// --- Import thư viện ---
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { cloudinary } = require("../config/cloudinary");

// === ĐĂNG KÝ NGƯỜI DÙNG ===
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email đã tồn tại" });

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const newUser = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({
      message: "Đăng ký thành công!",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error("Lỗi khi đăng ký:", err);
    res.status(500).json({ message: "Lỗi server khi đăng ký" });
  }
};

// === ĐĂNG NHẬP ===
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm user theo email
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Email không tồn tại" });

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Sai mật khẩu" });

    // Tạo JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Đăng nhập thành công!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || "user",
      },
    });
  } catch (err) {
    console.error("Lỗi khi đăng nhập:", err);
    res.status(500).json({ message: "Lỗi server khi đăng nhập" });
  }
};

// === LẤY DANH SÁCH TOÀN BỘ NGƯỜI DÙNG ===
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách người dùng:", err);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách người dùng" });
  }
};

// === XÓA NGƯỜI DÙNG THEO ID ===
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    res.status(200).json({ message: "Xóa người dùng thành công!" });
  } catch (err) {
    console.error("Lỗi khi xóa người dùng:", err);
    res.status(500).json({ message: "Lỗi server khi xóa người dùng" });
  }
};

// === LẤY THÔNG TIN CÁ NHÂN ===
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });

    res.status(200).json(user);
  } catch (err) {
    console.error("Lỗi khi lấy thông tin cá nhân:", err);
    res.status(500).json({ message: "Lỗi server khi lấy thông tin cá nhân" });
  }
};

// === CẬP NHẬT THÔNG TIN CÁ NHÂN ===
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true }
    ).select("-password");

    if (!updatedUser)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });

    res.status(200).json({
      message: "Cập nhật thành công!",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Lỗi khi cập nhật thông tin cá nhân:", err);
    res.status(500).json({ message: "Lỗi server khi cập nhật thông tin cá nhân" });
  }
};

// === UPLOAD ẢNH ĐẠI DIỆN ===
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "Không có file được tải lên" });

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "user_avatars",
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: { url: result.secure_url, public_id: result.public_id } },
      { new: true }
    );

    res.status(200).json({
      message: "Cập nhật ảnh đại diện thành công!",
      avatarUrl: user.avatar.url,
    });
  } catch (err) {
    console.error("Lỗi khi upload avatar:", err);
    res.status(500).json({ message: "Lỗi server khi upload avatar" });
  }
};
