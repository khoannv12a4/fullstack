const jwt = require('jsonwebtoken');
const config = require('../config');

const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId }, 
    config.JWT.ACCESS_SECRET, 
    { expiresIn: config.JWT.ACCESS_EXPIRY }
  );
  
  const refreshToken = jwt.sign(
    { userId }, 
    config.JWT.REFRESH_SECRET, 
    { expiresIn: config.JWT.REFRESH_EXPIRY }
  );
  
  return { accessToken, refreshToken };
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, config.JWT.ACCESS_SECRET);
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, config.JWT.REFRESH_SECRET);
};

module.exports = {
  generateTokens,
  verifyAccessToken,
  verifyRefreshToken
};