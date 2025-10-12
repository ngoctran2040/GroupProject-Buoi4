// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserList from './components/UserList';
import AddUser from './components/AddUser';
import './App.css';

function App() {
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
        <h1>Quản lý User</h1>
        {/* Truyền hàm fetchUsers xuống cho AddUser */}
        <AddUser onUserAdded={fetchUsers} />
        {/* Truyền danh sách users xuống cho UserList */}
        <UserList users={users} />
      </header>
    </div>
  );
}

export default App;