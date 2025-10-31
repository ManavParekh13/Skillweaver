// api/routes/swaps.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Our auth middleware
const Swap = require('../models/Swap');

// @route   POST /api/swaps
// @desc    Create a new swap request
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { providerId, skillRequested, skillOffered } = req.body;
    
    const newSwap = new Swap({
      requester: req.user.id,
      provider: providerId,
      skillRequested,
      skillOffered,
      status: 'pending'
    });

    await newSwap.save();
    res.status(201).json(newSwap);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/swaps/me
// @desc    Get all swaps related to the logged-in user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const swaps = await Swap.find({
      $or: [{ requester: req.user.id }, { provider: req.user.id }]
    })
    .populate('requester', 'username') // Get username from requester
    .populate('provider', 'username'); // Get username from provider

    res.json(swaps);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/swaps/:id
// @desc    Update a swap status (accept/decline)
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { status } = req.body; // 'accepted' or 'declined'

    let swap = await Swap.findById(req.params.id);
    if (!swap) return res.status(404).json({ msg: 'Swap not found' });

    // --- Security Check ---
    // Only the 'provider' (the user who got the request) can accept/decline
    if (swap.provider.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    // --- Check for valid status update ---
    if (swap.status !== 'pending') {
      return res.status(400).json({ msg: 'Swap has already been actioned' });
    }

    swap.status = status;
    await swap.save();
    
    // We need to re-populate the user data to send it back
    swap = await Swap.findById(req.params.id)
      .populate('requester', 'username')
      .populate('provider', 'username');
      
    res.json(swap);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;