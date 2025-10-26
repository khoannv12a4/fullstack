require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../../src/models/User');

const seedUsers = async () => {
  try {
    console.log('🌱 Seeding users...');
    
    // Check if users already exist
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      console.log('⚠️  Users already exist, skipping seed');
      return;
    }
    
    // Create admin user only
    const adminUser = new User({
      username: 'admin',
      email: 'admin@admin.com',
      password: 'admin123',
      role: 'admin',
      profile: {
        firstName: 'System',
        lastName: 'Administrator'
      }
    });
    
    await adminUser.save();
    console.log('✅ Admin user created: username=admin, password=admin123');
    
    console.log('🎉 User seeding completed');
    
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  }
};

module.exports = seedUsers;