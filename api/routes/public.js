// api/routes/public.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');

/**
 * @route   GET /api/public/users
 * @desc    Get all users who have at least one skill to teach
 * @access  Public
 */
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({
      // Find users where the 'skillsToTeach' array 
      // exists and is not empty.
      skillsToTeach: { $exists: true, $not: { $size: 0 } }
    }).select('-password'); // Exclude passwords

    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;