// api/server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Loads .env variables
const connectDB = require('./config/db'); // Import our DB connection logic

// --- Initialize Server ---
const app = express();
const PORT = process.env.PORT || 5000;

// --- Connect to Database ---
connectDB();

// --- Middlewares ---
// --- REPLACE app.use(cors()) WITH THIS ---

// Define allowed origins (your live frontend and your local machine)
const allowedOrigins = [
  'https://skillweaver.onrender.com', // Your live frontend
  'http://localhost:5173'           // Your local frontend
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman) or from your whitelist
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));
// ----------------------------------------
// Allows our server to understand JSON data sent in request bodies
app.use(express.json()); 

// --- Test Route ---
// A simple test to see if the server is alive
app.get('/', (req, res) => {
  res.send('SkillWeaver API is running!');
});

// --- API Routes (We will build these next) ---

app.use('/api/auth', require('./routes/auth'));
// app.use('/api/profile', require('./routes/profile'));
app.use('/api/profile', require('./routes/profile'));
// app.use('/api/matches', require('./routes/matches'));
app.use('/api/matches', require('./routes/matches'));
app.use('/api/public', require('./routes/public'));
app.use('/api/swaps', require('./routes/swaps'));

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});