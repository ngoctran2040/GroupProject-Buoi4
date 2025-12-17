const isAdmin = (req, res, next) => {
  // 'req.user' đã được gán từ middleware 'auth'
  if (req.user && req.user.role === 'admin') {
    next(); // Là admin, cho đi tiếp
  } else {
    res.status(403).json({ message: 'Truy cập bị cấm. Yêu cầu quyền Admin.' });
  }
};

module.exports = isAdmin;
