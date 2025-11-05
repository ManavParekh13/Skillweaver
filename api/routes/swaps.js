const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); 
const Swap = require('../models/Swap');

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

router.get('/me', auth, async (req, res) => {
  try {
    const swaps = await Swap.find({
      $or: [{ requester: req.user.id }, { provider: req.user.id }]
    })
    .populate('requester', 'username') 
    .populate('provider', 'username'); 

    res.json(swaps);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.put('/:id/complete', auth, async (req, res) => {
  try {
    let swap = await Swap.findById(req.params.id);
    if (!swap) return res.status(404).json({ msg: 'Swap not found' });

    if (
      swap.requester.toString() !== req.user.id &&
      swap.provider.toString() !== req.user.id
    ) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
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