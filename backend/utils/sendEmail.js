const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: { rejectUnauthorized: false },
  });

  const mailOptions = {
    from: `"Admin" <${process.env.EMAIL_USER}>`,
    to: options.to, // ✅ sửa ở đây
    subject: options.subject,
    html: options.html, // ✅ dùng HTML
  };

  await transporter.sendMail(mailOptions);
  console.log('📧 Email đã được gửi thành công tới:', options.to);
};

module.exports = sendEmail;
