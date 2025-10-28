import React, { useState } from "react";
import axios from "axios";
import "./Auth.css"; // ✅ 1. Import file CSS

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false); // Thêm state để biết khi nào thành công

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSuccess(false); // Reset
    try {
      const res = await axios.post("http://localhost:3000/users/signup", formData);
      setMessage(res.data.message || "Đăng ký thành công!");
      setIsSuccess(true); // ✅ Đặt là true
    } catch (err) {
      setMessage(err.response?.data?.message || "Lỗi khi đăng ký!");
      setIsSuccess(false); // ✅ Đặt là false
    }
  };

  return (
    // ✅ 2. Thêm class cho container
    <div className="auth-container"> 
      {/* ✅ 3. Thêm class cho form */}
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Đăng ký tài khoản</h2>
        
        <input
          type="text"
          name="name"
          placeholder="Họ tên"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Đăng ký</button>

        {/* ✅ 4. Thêm class cho message, và đổi màu dựa trên isSuccess */}
        {message && (
          <p className={`message ${isSuccess ? "success" : ""}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

export default Register;