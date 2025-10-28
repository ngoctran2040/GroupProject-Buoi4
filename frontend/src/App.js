<<<<<<< Updated upstream

// frontend/src/App.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserList from './components/UserList';
import AddUser from './components/AddUser';
import './App.css';
=======
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { useState } from "react";
import "./App.css"; 

// Import tất cả component
import Register from "./Register";
import Login from "./Login";
import Logout from "./Logout";
import Profile from "./Profile";
import AdminDashboard from "./AdminDashboard";
import ForgotPassword from "./ForgotPassword"; // ✅ 1. Import
import ResetPassword from "./ResetPassword";   // ✅ 2. Import

// Hàm helper để lấy thông tin role
const getRole = () => localStorage.getItem('role');
>>>>>>> Stashed changes


function App() {
<<<<<<< Updated upstream
  const [users, setUsers] = useState([]);

  // Hàm để lấy danh sách user từ backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách user!", error);
    }
  };

  // Tự động gọi hàm fetchUsers khi component được render lần đầu
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="App">

      <header className="App-header">
        <h1>Quản lý Người dùng</h1>
        {/* Truyền hàm fetchUsers xuống cho AddUser để nó có thể gọi làm mới danh sách */}
        <AddUser onUserAdded={fetchUsers} />
        {/* Truyền danh sách users xuống cho UserList để nó hiển thị */}
        <UserList users={users} />
      </header>

    </div>
=======
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  
  // Lấy role ngay khi App load hoặc khi isLoggedIn thay đổi
  const userRole = isLoggedIn ? getRole() : null;

  const handleLogin = () => {
    setIsLoggedIn(true);
    // userRole sẽ tự động cập nhật ở lần re-render tiếp theo
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email"); 
    localStorage.removeItem("role"); // ✅ Xóa role khi logout
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
              
              {/* ✅ Hiển thị link Admin nếu role là 'admin' */}
              {userRole === 'admin' && (
                <Link to="/admin">Quản lý</Link>
              )}

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
            
            {/* ✅ 3. Thêm 2 route mới cho Quên mật khẩu */}
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* Mặc định chuyển về login */}
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
        /* --- Route cho người ĐÃ đăng nhập --- */
          <>
            <Route path="/profile" element={<Profile />} />
            <Route path="/logout" element={<Logout onLogoutSuccess={handleLogout} />} />

            {/* ✅ Route Admin (chỉ user đã login MỚI vào được) */}
            {userRole === 'admin' && (
              <Route path="/admin" element={<AdminDashboard />} />
            )}
            
            {/* Mặc định (đã login) chuyển về profile */}
            <Route path="*" element={<Navigate to="/profile" />} />
          </>
        )}
      </Routes>
    </Router>
>>>>>>> Stashed changes
  );
}

export default App;
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
