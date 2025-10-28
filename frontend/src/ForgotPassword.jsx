import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Auth.css'; // Dùng chung CSS với Login

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsSuccess(false);

    try {
      // ✅ Gọi đúng endpoint backend
      const res = await axios.post('http://localhost:3000/auth/forgot-password', { email });

      setMessage(res.data.message || 'Đã gửi email, vui lòng kiểm tra hộp thư của bạn.');
      setIsSuccess(true);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Lỗi. Vui lòng thử lại.');
      setIsSuccess(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Quên mật khẩu</h2>
        <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
          Nhập email của bạn để nhận link đặt lại mật khẩu.
        </p>
        
        <label htmlFor="email-input" style={{textAlign: 'left'}}>Email:</label>
        <input
          id="email-input"
          type="email"
          name="email"
          placeholder="Email của bạn"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <button type="submit">Gửi Email</button>

        {message && (
          <p className={`message ${isSuccess ? 'success' : ''}`}>
            {message}
          </p>
        )}

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/login">Quay lại Đăng nhập</Link>
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword;
