// api/routes/profile.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Our auth middleware
const User = require('../models/User'); // Our User model

/**
 * @route   GET /api/profile/me
 * @desc    Get current user's profile
 * @access  Private
 */
router.get('/me', auth, async (req, res) => {
  // 'auth' is the middleware. If the token is valid, req.user will be populated.
  try {
    // req.user.id comes from the middleware decoding the token
    // We find the user but exclude the password from being returned
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    res.json(user);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   PUT /api/profile/me
 * @desc    Update current user's profile
 * @access  Private
 */
router.put('/me', auth, async (req, res) => {
  // Get the new data from the request body
  const { bio, skillsToTeach, skillsToLearn } = req.body;

  // Build the profile fields object
  const profileFields = {};
  if (bio !== undefined) profileFields.bio = bio;
  if (skillsToTeach !== undefined) profileFields.skillsToTeach = skillsToTeach;
  if (skillsToLearn !== undefined) profileFields.skillsToLearn = skillsToLearn;

  try {
    // Find the user by their ID (from the token) and update their profile
    // 'new: true' returns the updated document
    let user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: profileFields },
      { new: true }
    ).select('-password');

    res.json(user);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;