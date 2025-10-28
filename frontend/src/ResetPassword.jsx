import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './Auth.css'; // Dùng chung CSS

function ResetPassword() {
  // 1️⃣ Lấy token từ URL (ví dụ: /reset-password/abc123def → token = "abc123def")
  const { token } = useParams(); 
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 2️⃣ Hàm xử lý khi người dùng bấm “Lưu mật khẩu”
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Kiểm tra xác nhận mật khẩu
    if (password !== confirmPassword) {
      setError('❌ Mật khẩu không khớp. Vui lòng nhập lại.');
      return;
    }

    try {
      // 3️⃣ Gọi API Backend (đường dẫn và method đã sửa đúng)
      const res = await axios.post(
        `http://localhost:3000/auth/reset-password/${token}`,
        { password }
      );

      setMessage(res.data.message || '✅ Đặt lại mật khẩu thành công!');
      setError('');

      // 4️⃣ Tự động chuyển về trang đăng nhập sau 2 giây
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || '❌ Token không hợp lệ hoặc đã hết hạn.');
    }
  };

  // 5️⃣ Giao diện hiển thị
  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Đặt lại mật khẩu mới</h2>
        
        <label htmlFor="password-input" style={{textAlign: 'left'}}>Mật khẩu mới:</label>
        <input
          id="password-input"
          type="password"
          name="password"
          placeholder="Nhập mật khẩu mới"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <label htmlFor="confirm-input" style={{textAlign: 'left'}}>Xác nhận mật khẩu:</label>
        <input
          id="confirm-input"
          type="password"
          name="confirmPassword"
          placeholder="Nhập lại mật khẩu mới"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        
        <button type="submit">Lưu mật khẩu</button>

        {message && (
          <p className="message success">{message}</p>
        )}
        {error && (
          <p className="message">{error}</p>
        )}

        {/* Link quay lại đăng nhập */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/login">Quay lại Đăng nhập</Link>
        </div>
      </form>
    </div>
  );
}

export default ResetPassword;
