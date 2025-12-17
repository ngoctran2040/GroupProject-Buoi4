// --- Import thư viện ---
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// --- Cấu hình .env ---
dotenv.config();

// --- Khởi tạo app Express ---
const app = express();

// --- Middleware ---
app.use(cors({ origin: "*" })); // Cho phép CORS từ mọi nguồn
app.use(express.json()); // Cho phép đọc JSON body

// --- Kết nối MongoDB ---
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully!"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// --- Import routes ---
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth"); // ✅ Thêm route cho đăng nhập, đăng ký

// --- Dùng route ---
app.use("/users", userRoutes); // route cho quản lý người dùng (Admin)
app.use("/auth", authRoutes);  // route cho xác thực (đăng ký, đăng nhập, quên mk, reset mk)

// --- Route mặc định ---
app.get("/", (req, res) => {
  res.send("✅ Server API đang hoạt động!");
});

// --- Khởi động server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
