import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./AdminDashboard.css"; // CSS bảng quản lý

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // 🧩 1️⃣ Dùng useCallback (giờ chỉ phụ thuộc vào token)
  const fetchUsers = useCallback(async () => {
    try {
      setError("");
      const res = await axios.get("http://localhost:3000/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("❌ Lỗi khi tải danh sách:", err);
      setError(err.response?.data?.message || "Không thể tải danh sách người dùng");
    }
  }, [token]); // ✅ Chỉ phụ thuộc vào token (chuẩn nhất)

  // 🧩 2️⃣ Gọi fetchUsers khi component render lần đầu
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // 🧩 3️⃣ Xử lý xóa user
  const handleDelete = async (userId, userName) => {
    if (window.confirm(`Bạn có chắc muốn xóa user "${userName}"?`)) {
      try {
        setMessage("");
        setError("");
        const res = await axios.delete(
          `http://localhost:3000/users/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMessage(res.data.message || "Xóa thành công!");
        fetchUsers(); // ✅ Tải lại danh sách
      } catch (err) {
        console.error("❌ Lỗi khi xóa:", err);
        setError(err.response?.data?.message || "Lỗi khi xóa người dùng");
      }
    }
  };

  return (
    <div className="admin-container">
      <h2>Quản lý Người dùng</h2>

      {message && <p className="admin-message success">{message}</p>}
      {error && <p className="admin-message error">{error}</p>}

      {users.length === 0 ? (
        <p className="no-users">Không có người dùng nào.</p>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Email</th>
              <th>Role</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge role-${user.role}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(user._id, user.name)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminDashboard;
