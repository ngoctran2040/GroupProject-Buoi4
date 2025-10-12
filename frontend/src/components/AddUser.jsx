// src/components/AddUser.jsx
import React, { useState } from 'react';
import axios from 'axios';

const AddUser = () => {
  const [userName, setUserName] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault(); // Ngăn trình duyệt reload lại trang

    const newUser = { name: userName };

    axios.post("http://localhost:3000/users", newUser)
      .then(response => {
        console.log("User đã được thêm:", response.data);
        alert(`Đã thêm thành công user: ${userName}`);
        setUserName(''); // Xóa nội dung trong input sau khi thêm
        // Để tự động cập nhật danh sách, bạn cần refresh trang
        // hoặc dùng các kỹ thuật quản lý state phức tạp hơn (sẽ học sau)
        window.location.reload(); 
      })
      .catch(error => {
        console.error("Có lỗi xảy ra khi thêm user!", error);
        alert("Thêm user thất bại!");
      });
  };

  return (
    <div>
      <h2>Thêm Người dùng mới</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={userName}
          onChange={e => setUserName(e.target.value)}
          placeholder="Nhập tên người dùng"
          required
        />
        <button type="submit">Thêm User</button>
      </form>
    </div>
  );
};

export default AddUser;