import React, { useEffect, useState } from "react";
import axios from "axios";

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/users")
         .then(res => setUsers(res.data))
         .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Danh sách User</h2>
      <ul>
        {users.map(u => (
          <li key={u.id}>{u.name} – {u.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
