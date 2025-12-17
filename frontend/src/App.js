// --- App.js (đã hợp nhất hoàn chỉnh) ---
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import "./App.css";

// Import tất cả component
import Register from "./Register";
import Login from "./Login";
import Logout from "./Logout";
import Profile from "./Profile";
import AdminDashboard from "./AdminDashboard";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";

// Hàm helper để lấy thông tin role từ localStorage
const getRole = () => localStorage.getItem("role");

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  // Lấy role ngay khi App load hoặc khi isLoggedIn thay đổi
  const userRole = isLoggedIn ? getRole() : null;

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <nav className="navbar">
        <div className="nav-links">
          {!isLoggedIn ? (
            <>
              <Link to="/register">Đăng ký</Link>
              <Link to="/login">Đăng nhập</Link>
            </>
          ) : (
            <>
              <Link to="/profile">Thông tin cá nhân</Link>

              {/* Hiển thị link Quản lý nếu role là admin */}
              {userRole === "admin" && <Link to="/admin">Quản lý</Link>}

              <Link to="/logout">Đăng xuất</Link>
            </>
          )}
        </div>
      </nav>

      <Routes>
        {/* --- Route cho người CHƯA đăng nhập --- */}
        {!isLoggedIn ? (
          <>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login onLoginSuccess={handleLogin} />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
          /* --- Route cho người ĐÃ đăng nhập --- */
          <>
            <Route path="/profile" element={<Profile />} />
            <Route path="/logout" element={<Logout onLogoutSuccess={handleLogout} />} />

            {userRole === "admin" && (
              <Route path="/admin" element={<AdminDashboard />} />
            )}

            <Route path="*" element={<Navigate to="/profile" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
