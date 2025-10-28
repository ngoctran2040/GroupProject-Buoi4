import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; // ✅ 1. Import Link
import "./Auth.css"; 

function Login({ onLoginSuccess }) { 
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsError(false);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:3000/users/login", formData);
      
      // Lưu tất cả thông tin
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("email", formData.email);
      localStorage.setItem("role", res.data.role); // Lưu role (từ HĐ 3)

      setMessage("Đăng nhập thành công! Đang chuyển hướng...");
      setIsError(false);

      onLoginSuccess(); 

      setTimeout(() => {
        navigate("/"); 
      }, 1000);

    } catch (err) {
      setMessage(err.response?.data?.message || "Lỗi khi đăng nhập!");
      setIsError(true);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Đăng nhập</h2>
        
        <label htmlFor="login-email" style={{textAlign: 'left'}}>Email:</label>
        <input
          id="login-email"
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        
        <label htmlFor="login-password" style={{textAlign: 'left'}}>Mật khẩu:</label>
        <input
          id="login-password"
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={formData.password}
          onChange={handleChange}
          required
        />
        
        <button type="submit">Đăng nhập</button>

        {message && (
          <p className={`message ${isError ? "" : "success"}`}>
            {message}
          </p>
        )}
        
        {/* ✅ 2. Thêm link "Quên mật khẩu" */}
        <div className="forgot-password-link">
          <Link to="/forgot-password">Quên mật khẩu?</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;

