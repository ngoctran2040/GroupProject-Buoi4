import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

function Login({ onLoginSuccess }) {
  // --- STATE ---
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  // --- HÀM CẬP NHẬT INPUT ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- HÀM XỬ LÝ ĐĂNG NHẬP ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsError(false);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:3000/auth/login", formData);

      // ✅ Lưu token và refresh token
      localStorage.setItem("token", res.data.accessToken); // accessToken để xác thực
      localStorage.setItem("refreshToken", res.data.refreshToken); // refreshToken để làm mới
      localStorage.setItem("email", formData.email);
      localStorage.setItem("role", res.data.role || "user");

      // ✅ Thông báo và chuyển hướng
      setMessage("Đăng nhập thành công! Đang chuyển hướng...");
      setIsError(false);

      if (onLoginSuccess) onLoginSuccess();

      setTimeout(() => {
        navigate("/profile"); // chuyển đến trang cá nhân
      }, 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Lỗi khi đăng nhập!");
      setIsError(true);
    }
  };

  // --- JSX ---
  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Đăng nhập</h2>

        <label htmlFor="login-email" style={{ textAlign: "left" }}>
          Email:
        </label>
        <input
          id="login-email"
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="login-password" style={{ textAlign: "left" }}>
          Mật khẩu:
        </label>
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

        {/* --- Thông báo lỗi hoặc thành công --- */}
        {message && (
          <p className={`message ${isError ? "" : "success"}`}>{message}</p>
        )}

        {/* --- Link quên mật khẩu --- */}
        <div className="forgot-password-link">
          <Link to="/forgot-password">Quên mật khẩu?</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
