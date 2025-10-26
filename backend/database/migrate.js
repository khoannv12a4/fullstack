#!/usr/bin/env node

require('dotenv').config();
const mongoose = require('mongoose');
const MigrationManager = require('./MigrationManager');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📁 MongoDB Connected for migrations');
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    process.exit(1);
  }
};

const main = async () => {
  const command = process.argv[2];
  const args = process.argv.slice(3);

  await connectDB();
  const migrationManager = new MigrationManager();

  try {
    switch (command) {
      case 'create':
        if (!args[0]) {
          console.error('❌ Please provide a migration name');
          console.log('Usage: npm run migration:create <migration_name>');
          process.exit(1);
        }
        await migrationManager.createMigration(args[0]);
        break;

      case 'run':
        await migrationManager.runMigrations();
        break;

      case 'rollback':
        const steps = parseInt(args[0]) || 1;
        await migrationManager.rollbackMigrations(steps);
        break;

      case 'status':
        await migrationManager.getStatus();
        break;

      case 'reset':
        console.log('🔄 Resetting database...');
        await mongoose.connection.db.dropDatabase();
        console.log('✅ Database reset completed');
        break;

      default:
        console.log(`
🚀 Migration Commands:
===================

npm run migration:create <name>  - Create a new migration file
npm run migration:run            - Run pending migrations
npm run migration:rollback [n]   - Rollback last n migrations (default: 1)
npm run migration:status         - Show migration status
npm run migration:reset          - Reset entire database (⚠️  DANGER!)

Examples:
npm run migration:create create_users_table
npm run migration:create add_profile_fields
npm run migration:run
npm run migration:rollback 2
        `);
    }
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

main();