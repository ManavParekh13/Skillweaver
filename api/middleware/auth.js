// api/middleware/auth.js

const jwt = require('jsonwebtoken');
require('dotenv').config(); // To get the JWT_SECRET from .env

/**
 * This middleware function will be added to any route we want to protect.
 * It checks for a valid token in the request header.
 */
module.exports = function (req, res, next) {
  // 1. Get token from the header
  const token = req.header('Authorization');

  // 2. Check if no token is present
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // 3. Verify the token
  try {
    // The token from the header looks like "Bearer <token>". We split it and get just the token part.
    const tokenOnly = token.split(' ')[1];
    
    // Verify the token using our secret
    const decoded = jwt.verify(tokenOnly, process.env.JWT_SECRET);

    // If verified, 'decoded' will contain our payload (the user: { id: ... } object)
    // We attach this 'user' object to the 'req' object so our routes can access it
    req.user = decoded.user;
    
    // Call next() to move on to the next piece of middleware or the route handler
    next();
    
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};