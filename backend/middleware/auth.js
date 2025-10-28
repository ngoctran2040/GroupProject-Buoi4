const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = (req, res, next) => {
  try {
    // 1️⃣ Lấy token từ header
    const authHeader = req.headers.authorization || req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ message: "Không có token, truy cập bị từ chối" });
    }

    // 2️⃣ Kiểm tra định dạng "Bearer <token>"
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token không hợp lệ (thiếu tiền tố Bearer)" });
    }

    // 3️⃣ Lấy phần token thật sự
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token không hợp lệ" });
    }

    // 4️⃣ Xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "mySecretKey123");

    // 5️⃣ Gắn thông tin user vào request (dùng cho controller)
    req.user = decoded;

    next();
  } catch (err) {
    console.error("❌ Lỗi xác thực token:", err.message);
    return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};

module.exports = auth;
