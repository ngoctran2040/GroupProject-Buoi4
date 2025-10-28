const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Vui lòng nhập tên'],
  },
  email: {
    type: String,
    required: [true, 'Vui lòng nhập email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Vui lòng nhập email hợp lệ',
    ],
  },
  password: {
    type: String,
    required: [true, 'Vui lòng nhập mật khẩu'],
    minlength: 6,
  },

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },

  // ✅ THÊM TRƯỜNG NÀY — để lưu avatar vào DB
  avatar: {
    public_id: { type: String, default: null },
    url: { type: String, default: null },
  },

  // Cho hoạt động 4
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, { 
  timestamps: true 
});

module.exports = mongoose.model('User', userSchema);
