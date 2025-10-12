import React, { useState } from "react";
import axios from "axios";

const AddUser = () => {
  const [newUser, setNewUser] = useState({ name: "", email: "" });

  const handleChange = e =>
    setNewUser({ ...newUser, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    axios.post("http://localhost:3000/users", newUser)
         .then(() => alert("Đã thêm user thành công!"))
         .catch(err => console.error(err));
  };

  return (
    <div>
      <h2>Thêm User</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Tên" onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} />
        <button type="submit">Thêm</button>
      </form>
    </div>
  );
};

export default AddUser;
