// api/models/Swap.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const swapSchema = new Schema({
  // The user who is ASKING for the skill
  requester: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // The user who HAS the skill
  provider: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // The skill the requester WANTS
  skillRequested: {
    type: String,
    required: true
  },
  // The skill the requester is OFFERING
  skillOffered: {
    type: String,
    required: true
  },
  // The state of the swap
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'completed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Swap', swapSchema);