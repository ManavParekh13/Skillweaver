const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    default: ''
  },

  location: { 
    type: String,
    default: ''
  },
  
  skillsToTeach: [
    {
      skill: { type: String, required: true },
      level: { type: String, required: true, default: 'Beginner' }
    }
  ],
  
  skillsToLearn: [String]
}, {
  timestamps: true 
});

module.exports = mongoose.model('User', userSchema);