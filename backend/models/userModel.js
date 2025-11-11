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
    enum: ['user', 'admin','moderator'],
    default: 'user',
  },

  avatar: {
    public_id: { type: String, default: null },
    url: { type: String, default: null },
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, { 
  timestamps: true 
});

module.exports = mongoose.model('User', userSchema);
