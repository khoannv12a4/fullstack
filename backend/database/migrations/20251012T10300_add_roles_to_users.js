const mongoose = require('mongoose');

/**
 * Migration: add_roles_to_users
 * Created: 2025-10-12T10:30:03.777Z
 */

const up = async () => {
  console.log('Running migration: add_roles_to_users');
  
  const db = mongoose.connection.db;
  const usersCollection = db.collection('users');
  
  // Add role field to all existing users (set default to 'user')
  await usersCollection.updateMany(
    { role: { $exists: false } }, // Only update documents that don't have role field
    { 
      $set: { 
        role: 'user',
        permissions: []
      } 
    }
  );
  console.log('✅ Added role field to existing users');
  
  // Create index for role field for faster queries
  await usersCollection.createIndex({ role: 1 });
  console.log('✅ Role index created');
  
  // Create index for permissions array
  await usersCollection.createIndex({ permissions: 1 });
  console.log('✅ Permissions index created');
  
  console.log('Migration add_roles_to_users completed successfully');
};

const down = async () => {
  console.log('Rolling back migration: add_roles_to_users');
  
  const db = mongoose.connection.db;
  const usersCollection = db.collection('users');
  
  // Remove role and permissions fields from all users
  await usersCollection.updateMany(
    {},
    { 
      $unset: { 
        role: "",
        permissions: "" 
      } 
    }
  );
  console.log('✅ Removed role and permissions fields from users');
  
  // Drop the role and permissions indexes
  try {
    await usersCollection.dropIndex({ role: 1 });
    console.log('✅ Role index dropped');
  } catch (error) {
    console.log('⚠️  Role index not found, skipping');
  }
  
  try {
    await usersCollection.dropIndex({ permissions: 1 });
    console.log('✅ Permissions index dropped');
  } catch (error) {
    console.log('⚠️  Permissions index not found, skipping');
  }
  
  console.log('Migration add_roles_to_users rolled back successfully');
};

module.exports = { up, down };
