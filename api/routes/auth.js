// api/routes/auth.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // We'll use this to hash passwords
const jwt = require('jsonwebtoken'); // To create a token for the user
const User = require('../models/User'); // Our User model

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', async (req, res) => {
  // 1. Get username, email, and password from the request body
  const { username, email, password } = req.body;

  try {
    // 2. Check if a user with this email already exists
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // 3. If user doesn't exist, create a new one
    user = new User({
      username,
      email,
      password,
    });

    // 4. Hash the password before saving it
    const salt = await bcrypt.genSalt(10); // Generate a 'salt'
    user.password = await bcrypt.hash(password, salt); // Hash the password

    // 5. Save the user to the database
    await user.save();

    // 6. Send a success response
    res.status(201).json({ msg: 'User registered successfully' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if the user exists by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // 2. Check if the password matches
    // We use bcrypt.compare to check the plain text password against the hashed one
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // 3. If credentials are correct, create a JWT (JSON Web Token)
    
    // The 'payload' is the data we want to store in the token
    const payload = {
      user: {
        id: user.id, // This 'id' comes from MongoDB
      },
    };

    // Sign the token
    jwt.sign(
      payload,
      process.env.JWT_SECRET, // Your secret key from .env
      { expiresIn: '30d' },    // Token expires in 30 days
      (err, token) => {
        if (err) throw err;
        // 4. Send the token back to the client
        res.json({ token }); 
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


module.exports = router;