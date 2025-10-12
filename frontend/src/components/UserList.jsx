// src/components/UserList.jsx
import React from 'react';

// Nhận prop 'users' từ App.js
const UserList = ({ users }) => {
  return (
    <div>
      <h2>Danh sách User</h2>
      <ul>
        {/* Dùng mảng users được truyền vào để hiển thị */}
        {users.map((user) => (
          <li key={user._id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;