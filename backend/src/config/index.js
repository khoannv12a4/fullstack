const config = {
  // Server
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Database
  MONGODB_URI: process.env.MONGODB_URI,
  
  // JWT
  JWT: {
    ACCESS_SECRET: process.env.JWT_SECRET,
    REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    ACCESS_EXPIRY: process.env.JWT_EXPIRE || '15m',
    REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRE || '7d'
  },
  
  // Security
  BCRYPT_ROUNDS: 10,
  
  // Rate Limiting
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100
  }
};

module.exports = config;