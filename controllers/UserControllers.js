const {
  createUser: _createUser,
  getUsers: _getUsers,
  getUser: _getUser,
} = require('../services/UserServices');
const User = require('../models/User');
const bcrypt = require('bcrypt');

const createUser = async (req, res) => {
  const { username, name, password } = req.body;

  const existingUser = await User.findOne({ username });

  if (existingUser) {
    return res.status(400).send({ error: 'username must be unique' });
  }

  if (!password || password.length < 3)
    return res
      .status(400)
      .send({ error: 'password must be at least 3 characters long' });

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const createdUser = await _createUser(user);

  res.status(201).json(createdUser);
};

const getUsers = async (req, res) => {
  const users = await _getUsers();
  res.json(users);
};

const getUser = async (req, res) => {
  const user = await _getUser(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).send({ error: 'user not found' });
  }
};

module.exports = {
  createUser,
  getUsers,
};
