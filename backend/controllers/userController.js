let users = [];

// GET /users
exports.getUsers = (req, res) => {
  res.json(users);
};

// POST /users
exports.createUser = (req, res) => {
  const newUser = req.body;
  users.push(newUser);
  res.status(201).json(newUser);
};
