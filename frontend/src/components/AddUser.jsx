import React, { useState } from "react";
import axios from "axios";


// Nhận prop onUserAdded từ App.js
const AddUser = ({ onUserAdded }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    // TẠO MỘT ĐỐI TƯỢNG MỚI CHỨA DỮ LIỆU TỪ STATE
    const newUser = {
      name: name,
      email: email
    };

    // GỬI ĐỐI TƯỢNG NÀY ĐI
    axios.post("http://localhost:3000/users", newUser) // <-- ĐẢM BẢO BẠN GỬI newUser
      .then(response => {
        alert(`Đã thêm thành công user: ${name}`);
        setName('');
        setEmail('');
        // Gọi hàm của component cha để làm mới danh sách
        if (onUserAdded) {
          onUserAdded(); 
        }
      })
      .catch(error => {
        // Log lỗi chi tiết từ backend ra console để dễ gỡ lỗi
        console.error("Có lỗi xảy ra khi thêm user!", error.response ? error.response.data : error.message);
        alert("Thêm user thất bại! Email có thể đã tồn tại hoặc bạn chưa nhập đủ thông tin.");
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
          placeholder="Nhập tên người dùng"
          required
        />
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Nhập email"
          required
        />
        <button type="submit">Thêm User</button>
      </form>
    </div>
  );
};

export default AddUser;
