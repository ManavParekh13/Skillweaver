// api/routes/swaps.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); 
const Swap = require('../models/Swap');

// --- POST /api/swaps ---
// (This is your existing code, it is correct)
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
    
    // Populate the new swap before sending it back
    const populatedSwap = await Swap.findById(newSwap._id)
      .populate('requester', 'username')
      .populate('provider', 'username');
      
    res.status(201).json(populatedSwap);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- GET /api/swaps/me ---
// (This is your existing code, it is correct)
router.get('/me', auth, async (req, res) => {
  try {
    const swaps = await Swap.find({
      $or: [{ requester: req.user.id }, { provider: req.user.id }]
    })
    .populate('requester', 'username') 
    .populate('provider', 'username')
    .sort({ createdAt: -1 }); // <-- Added sort to show newest first

    res.json(swaps);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- NEW ---
// --- PUT /api/swaps/:id/accept ---
router.put('/:id/accept', auth, async (req, res) => {
  try {
    let swap = await Swap.findById(req.params.id);
    if (!swap) return res.status(404).json({ msg: 'Swap not found' });

    // Security check: Only the provider can accept a swap
    if (swap.provider.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    // Check if swap is still pending
    if (swap.status !== 'pending') {
      return res.status(400).json({ msg: 'Swap is no longer pending' });
    }

    swap.status = 'accepted';
    await swap.save();
    
    // Re-populate to send full data back to frontend
    swap = await Swap.findById(req.params.id)
      .populate('requester', 'username')
      .populate('provider', 'username');
      
    res.json(swap);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- NEW ---
// --- PUT /api/swaps/:id/reject ---
router.put('/:id/reject', auth, async (req, res) => {
  try {
    let swap = await Swap.findById(req.params.id);
    if (!swap) return res.status(404).json({ msg: 'Swap not found' });

    // Security check: Only the provider can reject a swap
    if (swap.provider.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    // Check if swap is still pending
    if (swap.status !== 'pending') {
      return res.status(400).json({ msg: 'Swap is no longer pending' });
    }

    swap.status = 'declined'; // Use 'declined' from your model
    await swap.save();
    
    swap = await Swap.findById(req.params.id)
      .populate('requester', 'username')
      .populate('provider', 'username');
      
    res.json(swap);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// --- PUT /api/swaps/:id/complete ---
// (This is your existing code, it is correct)
router.put('/:id/complete', auth, async (req, res) => {
  try {
    let swap = await Swap.findById(req.params.id);
    if (!swap) return res.status(404).json({ msg: 'Swap not found' });

    // Security check: Either user can mark as complete
    if (
      swap.requester.toString() !== req.user.id &&
      swap.provider.toString() !== req.user.id
    ) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    // Check if swap is 'accepted'
    if (swap.status !== 'accepted') {
      return res.status(400).json({ msg: 'Only accepted swaps can be completed' });
    }

    swap.status = 'completed';
    await swap.save();
    
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