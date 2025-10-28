import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css'; // File CSS mới để style bảng

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const authHeaders = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // 1. Hàm lấy danh sách user
  const fetchUsers = async () => {
    try {
      setError('');
      const res = await axios.get(
        'http://localhost:3000/users',
        authHeaders
      );
      setUsers(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải danh sách');
    }
  };

  // 2. Tự động gọi hàm fetchUsers khi component render
  useEffect(() => {
    fetchUsers();
  }, []); // Chỉ chạy 1 lần

  // 3. Hàm xử lý xóa user
  const handleDelete = async (userId, userName) => {
    if (window.confirm(`Bạn có chắc muốn xóa user "${userName}"?`)) {
      try {
        setMessage('');
        setError('');
        const res = await axios.delete(
          `http://localhost:3000/users/${userId}`,
          authHeaders
        );
        setMessage(res.data.message || 'Xóa thành công!');
        // Tải lại danh sách user sau khi xóa
        fetchUsers(); 
      } catch (err) {
        setError(err.response?.data?.message || 'Lỗi khi xóa');
      }
    }
  };

  return (
    <div className="admin-container">
      <h2>Quản lý Người dùng</h2>
      {message && <p className="admin-message success">{message}</p>}
      {error && <p className="admin-message error">{error}</p>}

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
    </div>
  );
}

export default AdminDashboard;
