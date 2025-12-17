import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ 1. Import
import "./Auth.css"; // Dùng chung CSS

function Logout({ onLogoutSuccess }) { // ✅ 2. Nhận prop 'onLogoutSuccess'
  const navigate = useNavigate(); // ✅ 3. Khởi tạo hook

  const handleLogout = () => {
    // ✅ 4. BÁO CHO APP.JS BIẾT: "Tôi muốn đăng xuất!"
    // App.js sẽ tự xóa token VÀ gọi setIsLoggedIn(false)
    onLogoutSuccess(); 
    
    // ❌ 5. Xóa các lệnh cũ
    // localStorage.removeItem("token"); 
    // alert("Đăng xuất thành công!");
    // window.location.href = "/login"; 

    // ✅ 6. Dùng navigate để điều hướng
    navigate("/login");
  };

  return (
    <div className="auth-container">
      <div className="auth-form" style={{ textAlign: "center" }}>
        <h2>Đăng xuất</h2>
        <p style={{ margin: "1.5rem 0" }}>Bạn có chắc muốn đăng xuất?</p>
        <button onClick={handleLogout} style={{backgroundColor: '#dc3545'}}>
          Xác nhận Đăng xuất
        </button>
      </div>
    </div>
  );
}

export default Logout;