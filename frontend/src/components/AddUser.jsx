// src/components/AddUser.jsx
import React, { useState } from 'react';
import axios from 'axios';

// Nhận prop onUserAdded từ App.js
const AddUser = ({ onUserAdded }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    axios.post("http://localhost:3000/users", { name, email })
      .then(response => {
        alert(`Đã thêm thành công user: ${name}`);
        setName('');
        setEmail('');
        // Gọi hàm của component cha để làm mới danh sách
        onUserAdded(); 
      })
      .catch(error => {
        console.error("Có lỗi xảy ra khi thêm user!", error);
        alert("Thêm user thất bại! Email có thể đã tồn tại.");
      });
  };

  return (
    <div>
      <h2>Thêm User</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Nhập tên"
          required
        />
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Nhập email"
          required
        />
        <button type="submit">Thêm</button>
      </form>
    </div>
  );
};

export default AddUser;