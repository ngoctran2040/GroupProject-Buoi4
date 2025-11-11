// --- Import thư viện ---
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const sharp = require("sharp");
const streamifier = require("streamifier");
const User = require("../models/userModel");
const { cloudinary } = require("../config/cloudinary");

// === ĐĂNG KÝ NGƯỜI DÙNG ===
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email đã tồn tại" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    res.status(201).json({
      message: "Đăng ký thành công!",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("❌ Lỗi khi đăng ký:", err);
    res.status(500).json({ message: "Lỗi server khi đăng ký" });
  }
};

// === ĐĂNG NHẬP ===
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Email không tồn tại" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Sai mật khẩu" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "mySecretKey123",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Đăng nhập thành công!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("❌ Lỗi khi đăng nhập:", err);
    res.status(500).json({ message: "Lỗi server khi đăng nhập" });
  }
};

// === LẤY DANH SÁCH NGƯỜI DÙNG ===
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    console.error("❌ Lỗi khi lấy danh sách người dùng:", err);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách người dùng" });
  }
};

// === XÓA NGƯỜI DÙNG ===
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    res.status(200).json({ message: "Xóa người dùng thành công!" });
  } catch (err) {
    console.error("❌ Lỗi khi xóa người dùng:", err);
    res.status(500).json({ message: "Lỗi server khi xóa người dùng" });
  }
};

// === LẤY THÔNG TIN CÁ NHÂN ===
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const user = await User.findById(userId).select("-password");
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    res.status(200).json(user);
  } catch (err) {
    console.error("❌ Lỗi khi lấy thông tin cá nhân:", err);
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
    console.error("❌ Lỗi khi cập nhật thông tin cá nhân:", err);
    res.status(500).json({ message: "Lỗi server khi cập nhật thông tin cá nhân" });
  }
};

// === UPLOAD ẢNH ĐẠI DIỆN (Nâng cao: Multer + Sharp + Cloudinary) ===
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "Không có file được tải lên" });

    // ✅ Resize bằng Sharp
    const resizedBuffer = await sharp(req.file.path)
      .resize(300, 300)
      .jpeg({ quality: 80 })
      .toBuffer();

    // ✅ Upload lên Cloudinary qua stream
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "user_avatars", resource_type: "image" },
      async (error, result) => {
        if (error) {
          console.error("❌ Lỗi upload Cloudinary:", error);
          return res.status(500).json({ message: "Lỗi khi upload lên Cloudinary" });
        }

        // ✅ Cập nhật DB
        const user = await User.findByIdAndUpdate(
          req.user.id,
          {
            avatar: {
              url: result.secure_url,
              public_id: result.public_id,
            },
          },
          { new: true }
        );

        // ✅ Xóa file tạm
        fs.unlinkSync(req.file.path);

        res.status(200).json({
          message: "Cập nhật ảnh đại diện thành công!",
          avatarUrl: user.avatar.url,
        });
      }
    );

    // ✅ Dùng streamifier để gửi buffer
    streamifier.createReadStream(resizedBuffer).pipe(uploadStream);

  } catch (err) {
    console.error("❌ Lỗi khi upload avatar:", err);
    res.status(500).json({ message: "Lỗi server khi upload avatar" });
  }
};
