// api/config/db.js

const mongoose = require('mongoose');
require('dotenv').config(); // To access process.env.MONGO_URI

const connectDB = async () => {
  try {
    // Mongoose.connect returns a promise, so we await it
    await mongoose.connect(process.env.MONGO_URI);

    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    // Exit process with failure if we can't connect
    process.exit(1); 
  }
};

module.exports = connectDB;