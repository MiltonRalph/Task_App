const User = require('../Models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

// Register a new user
const registerUser = async (req, res) => {
  const { username, email, password } = req.body

  try {
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res
        .status(400)
        .send({ success: false, message: 'User already exists' })
    }

    // Hash Password
    var salt = bcrypt.genSaltSync(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    })

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
      })

      res.status(201).send({
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      })
    }
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: 'Server error', error: error.message })
  }
}

// Authenticate and login user
const authUser = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // CHeck user password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(500).send({
        success: false,
        message: 'Wrong Password',
      })
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    })

    res.json({
      token,
      user: {
        id: user._id,
        username: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

// Get Users
const getUsers = async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users from the database
    res.status(200).json(users); // Send the list of users as a response
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching users' });
  }
};


module.exports = { registerUser, authUser, getUsers }
