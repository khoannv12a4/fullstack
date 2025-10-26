require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../../src/config/database');

// Import seeders
const seedUsers = require('./userSeeder');

const runSeeders = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to database
    await connectDB();
    
    // Run seeders
    await seedUsers();
    
    console.log('🎉 All seeders completed successfully');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

// Run if called directly
if (require.main === module) {
  runSeeders();
}

module.exports = runSeeders;