const multer = require("multer");
const path = require("path");

// Cấu hình bộ nhớ tạm
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Giới hạn loại file
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Định dạng file không hợp lệ"), false);
};

module.exports = multer({ storage, fileFilter });
