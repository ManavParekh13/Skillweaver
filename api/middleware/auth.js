const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (req, res, next) {

  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const tokenOnly = token.split(' ')[1];
    
    const decoded = jwt.verify(tokenOnly, process.env.JWT_SECRET);

    req.user = decoded.user;
    
    next();
    
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};