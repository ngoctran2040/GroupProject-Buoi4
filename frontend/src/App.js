// src/App.js
import React from 'react';
import UserList from './components/UserList';
import AddUser from './components/AddUser';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Quản lý Người dùng</h1>
        <AddUser />
        <UserList />
      </header>
    </div>
  );
}

export default App;