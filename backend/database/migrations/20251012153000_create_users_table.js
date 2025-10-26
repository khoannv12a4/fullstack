const mongoose = require('mongoose');

/**
 * Migration: create_users_table
 * Created: 2025-10-12T15:30:00.000Z
 */

const up = async () => {
  console.log('Running migration: create_users_table');
  
  // Create users collection with indexes
  const db = mongoose.connection.db;
  
  // Create collection if it doesn't exist
  const collections = await db.listCollections({ name: 'users' }).toArray();
  if (collections.length === 0) {
    await db.createCollection('users');
    console.log('✅ Users collection created');
  }
  
  // Create indexes
  const usersCollection = db.collection('users');
  
  // Email index (unique)
  await usersCollection.createIndex({ email: 1 }, { unique: true });
  console.log('✅ Email index created');
  
  // Username index (unique)
  await usersCollection.createIndex({ username: 1 }, { unique: true });
  console.log('✅ Username index created');
  
  // Refresh tokens index
  await usersCollection.createIndex({ 'refreshTokens.token': 1 });
  console.log('✅ Refresh tokens index created');
  
  // Created at index for sorting
  await usersCollection.createIndex({ createdAt: -1 });
  console.log('✅ CreatedAt index created');
  
  // Active users index
  await usersCollection.createIndex({ isActive: 1 });
  console.log('✅ IsActive index created');
  
  console.log('Migration create_users_table completed successfully');
};

const down = async () => {
  console.log('Rolling back migration: create_users_table');
  
  const db = mongoose.connection.db;
  
  // Drop the users collection
  try {
    await db.dropCollection('users');
    console.log('✅ Users collection dropped');
  } catch (error) {
    if (error.codeName !== 'NamespaceNotFound') {
      throw error;
    }
    console.log('⚠️  Users collection not found, skipping');
  }
  
  console.log('Migration create_users_table rolled back successfully');
};

module.exports = { up, down };