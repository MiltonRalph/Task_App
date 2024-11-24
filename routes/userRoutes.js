const express = require('express');
const {
  registerUser,
  authUser,
  getUsers,
} = require('../controllers/userController');

userRoutes = express.Router();

// Routes
userRoutes.route('/').get(getUsers);
userRoutes.post('/register', registerUser);
userRoutes.post('/login', authUser);

module.exports = userRoutes;
