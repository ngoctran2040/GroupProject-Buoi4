// --- Import thư viện Express ---
const express = require('express');
const app = express();

// --- Cho phép truy cập từ mọi nguồn (fix lỗi CORS khi test HTML) ---
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// --- Cho phép đọc JSON từ body request ---
app.use(express.json());

// --- Import file routes ---
const userRoutes = require('./routes/user');

// --- Sử dụng route /users ---
app.use('/', userRoutes);

// --- Chạy server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
