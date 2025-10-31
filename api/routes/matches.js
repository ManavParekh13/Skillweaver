// api/routes/matches.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Our auth middleware
const User = require('../models/User'); // Our User model

/**
 * @route   GET /api/matches
 * @desc    Get all users who can teach a skill the current user wants to learn
 * @access  Private
 */
router.get('/', auth, async (req, res) => {
  try {
    // 1. Get the current user's profile
    // We only need the 'skillsToLearn' field
    const currentUser = await User.findById(req.user.id).select('skillsToLearn');

    if (!currentUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // 2. Get the array of skills the user wants to learn
    const skillsToLearn = currentUser.skillsToLearn;

    // 3. Find all *other* users...
    const matches = await User.find({
      // ...who are NOT the current user
      _id: { $ne: req.user.id }, 
      
      "skillsToTeach.skill": { $in: skillsToLearn }
      
    }).select('-password'); // Don't return their passwords!

    // 4. Return the list of matched users
    res.json(matches);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;