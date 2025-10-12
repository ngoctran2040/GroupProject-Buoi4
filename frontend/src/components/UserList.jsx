// src/components/UserList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Gọi API để lấy danh sách người dùng khi component được render
    axios.get("http://localhost:3000/users")
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error("Có lỗi xảy ra khi lấy danh sách user!", error);
      });
  }, []); // Mảng rỗng đảm bảo useEffect chỉ chạy 1 lần

  return (
    <div>
      <h2>Danh sách Người dùng</h2>
      <ul>
        {users.map((user, index) => (
          <li key={index}>{user.name}</li> // Giả sử mỗi user có thuộc tính 'name'
        ))}
      </ul>
    </div>
  );
};

export default UserList;