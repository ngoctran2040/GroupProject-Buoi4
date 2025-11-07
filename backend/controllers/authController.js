const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");
const RefreshToken = require("../models/refreshTokenModel");

// --- Đăng ký tài khoản ---
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Kiểm tra email tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email đã được đăng ký" });

    // Mã hoá mật khẩu và tạo user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({
      message: "Đăng ký thành công",
      user: { id: newUser._id, email: newUser.email },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Lỗi server khi đăng ký" });
  }
};

// --- Đăng nhập (Access + Refresh Token) ---
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra email tồn tại không
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Email không tồn tại" });

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Sai mật khẩu" });

    // Tạo Access Token (15 phút)
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "mySecretKey123",
      { expiresIn: "10s" }
    );

    // Tạo Refresh Token (7 ngày)
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_SECRET || "myRefreshSecret123",
      { expiresIn: "7d" }
    );

    // Lưu Refresh Token vào DB
    await RefreshToken.create({
      userId: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.status(200).json({
      message: "Đăng nhập thành công!",
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Lỗi server khi đăng nhập" });
  }
};

// --- API làm mới Access Token ---
exports.refreshToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token)
      return res.status(401).json({ message: "Thiếu Refresh Token" });

    const stored = await RefreshToken.findOne({ token });
    if (!stored)
      return res.status(403).json({ message: "Refresh Token không hợp lệ" });

    jwt.verify(token, process.env.REFRESH_SECRET || "myRefreshSecret123", (err, decoded) => {
      if (err)
        return res.status(403).json({ message: "Refresh Token đã hết hạn" });

      const newAccessToken = jwt.sign(
        { id: decoded.id },
        process.env.JWT_SECRET || "mySecretKey123",
        { expiresIn: "15m" }
      );

      res.status(200).json({ accessToken: newAccessToken });
    });
  } catch (err) {
    console.error("Refresh token error:", err);
    res.status(500).json({ message: "Lỗi server khi refresh token" });
  }
};

// --- API Logout (Huỷ Refresh Token) ---
exports.logout = async (req, res) => {
  try {
    const { token } = req.body;
    await RefreshToken.findOneAndDelete({ token });
    res.status(200).json({ message: "Đăng xuất thành công!" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Lỗi server khi logout" });
  }
};

// --- Quên mật khẩu ---
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Email không tồn tại" });

    // Tạo token reset ngẫu nhiên
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 phút
    await user.save();

    // Link reset gửi cho người dùng
    const resetUrl = `http://localhost:3001/reset-password/${resetToken}`;
    const messageHTML = `
      <h3>Xin chào ${user.name || "bạn"},</h3>
      <p>Bạn đã yêu cầu đặt lại mật khẩu. Nhấn vào liên kết dưới đây để tiếp tục:</p>
      <a href="${resetUrl}" target="_blank" style="color:blue;">Đặt lại mật khẩu</a>
      <p>Liên kết này sẽ hết hạn sau 10 phút.</p>
      <br/>
      <p>Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>
    `;

    await sendEmail({
      to: user.email,
      subject: "Yêu cầu đặt lại mật khẩu",
      html: messageHTML,
    });

    res.status(200).json({ message: "Đã gửi email khôi phục mật khẩu" });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Lỗi server khi gửi email khôi phục" });
  }
};

// --- Đặt lại mật khẩu ---
exports.resetPassword = async (req, res) => {
  try {
    const resetToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn" });

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ message: "Đặt lại mật khẩu thành công" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Lỗi server khi đặt lại mật khẩu" });
  }
};
