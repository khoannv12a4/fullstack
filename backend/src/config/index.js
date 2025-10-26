const config = {
  // Server
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Database
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/fullstack',
  
  // JWT
  JWT: {
    ACCESS_SECRET: process.env.JWT_SECRET || 'dev-secret-key',
    REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-key',
    ACCESS_EXPIRY: process.env.JWT_EXPIRES_IN || '15m',
    REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  },
  
  // Security
  BCRYPT_ROUNDS: 10,
  
  // Rate Limiting
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100
  }
};

// Validate required environment variables in production
if (config.NODE_ENV === 'production') {
  const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(varName => console.error(`   - ${varName}`));
    process.exit(1);
  }
}

module.exports = config;