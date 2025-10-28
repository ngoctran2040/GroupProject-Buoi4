<<<<<<< Updated upstream
// --- Import các thư viện cần thiết ---
const express = require('express');
const mongoose = require('mongoose'); // Thư viện để làm việc với MongoDB
const cors = require('cors');
require('dotenv').config(); // Nạp các biến môi trường từ file .env

const app = express();

// --- Sử dụng các Middleware ---
// 1. Cho phép các yêu cầu từ các domain khác (CORS)
app.use(cors()); 

// 2. Cho phép đọc dữ liệu JSON từ body của request
app.use(express.json());

// --- Kết nối tới cơ sở dữ liệu MongoDB Atlas ---
// Lấy chuỗi kết nối từ file .env để bảo mật
=======
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối MongoDB
>>>>>>> Stashed changes
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Dùng route /users cho cả CRUD và auth
const userRoutes = require('./routes/user');
app.use('/users', userRoutes);

<<<<<<< Updated upstream
// --- Sử dụng route cho users ---
// Tất cả các request tới '/users' sẽ được xử lý bởi userRoutes
app.use('/users', userRoutes);

// --- Khởi động server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
=======
// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
>>>>>>> Stashed changes
