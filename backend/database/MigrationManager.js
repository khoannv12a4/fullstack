const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

class MigrationManager {
  constructor() {
    this.migrationsPath = path.join(__dirname, 'migrations');
    this.migrationSchema = new mongoose.Schema({
      name: { type: String, required: true, unique: true },
      batch: { type: Number, required: true },
      executedAt: { type: Date, default: Date.now }
    });
    this.Migration = mongoose.model('Migration', this.migrationSchema);
  }

  async createMigration(name) {
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '').slice(0, 14);
    const fileName = `${timestamp}_${name}.js`;
    const filePath = path.join(this.migrationsPath, fileName);
    
    const template = `const mongoose = require('mongoose');

/**
 * Migration: ${name}
 * Created: ${new Date().toISOString()}
 */

const up = async () => {
  console.log('Running migration: ${name}');
  
  // TODO: Implement your migration logic here
  // Example:
  // await mongoose.connection.db.createCollection('your_collection');
  // await mongoose.connection.db.collection('your_collection').createIndex({ email: 1 }, { unique: true });
  
  console.log('Migration ${name} completed successfully');
};

const down = async () => {
  console.log('Rolling back migration: ${name}');
  
  // TODO: Implement your rollback logic here
  // Example:
  // await mongoose.connection.db.dropCollection('your_collection');
  
  console.log('Migration ${name} rolled back successfully');
};

module.exports = { up, down };
`;

    fs.writeFileSync(filePath, template);
    console.log(`Migration created: ${fileName}`);
    return fileName;
  }

  async getMigrationFiles() {
    if (!fs.existsSync(this.migrationsPath)) {
      fs.mkdirSync(this.migrationsPath, { recursive: true });
      return [];
    }
    
    return fs.readdirSync(this.migrationsPath)
      .filter(file => file.endsWith('.js'))
      .sort();
  }

  async getExecutedMigrations() {
    try {
      const executed = await this.Migration.find().sort({ batch: 1, name: 1 });
      return executed.map(m => m.name);
    } catch (error) {
      // Collection might not exist yet
      return [];
    }
  }

  async runMigrations() {
    console.log('🚀 Running migrations...');
    
    const migrationFiles = await this.getMigrationFiles();
    const executedMigrations = await this.getExecutedMigrations();
    
    const pendingMigrations = migrationFiles.filter(file => 
      !executedMigrations.includes(file)
    );

    if (pendingMigrations.length === 0) {
      console.log('✅ No pending migrations');
      return;
    }

    const currentBatch = await this.getNextBatch();

    for (const migrationFile of pendingMigrations) {
      try {
        console.log(`📦 Running migration: ${migrationFile}`);
        
        const migrationPath = path.join(this.migrationsPath, migrationFile);
        const migration = require(migrationPath);
        
        await migration.up();
        
        // Record the migration
        await this.Migration.create({
          name: migrationFile,
          batch: currentBatch
        });
        
        console.log(`✅ Migration completed: ${migrationFile}`);
      } catch (error) {
        console.error(`❌ Migration failed: ${migrationFile}`);
        console.error(error);
        throw error;
      }
    }

    console.log(`🎉 All migrations completed! Batch: ${currentBatch}`);
  }

  async rollbackMigrations(steps = 1) {
    console.log(`🔄 Rolling back ${steps} migration(s)...`);
    
    const executedMigrations = await this.Migration
      .find()
      .sort({ batch: -1, executedAt: -1 })
      .limit(steps);

    if (executedMigrations.length === 0) {
      console.log('✅ No migrations to rollback');
      return;
    }

    for (const migrationRecord of executedMigrations) {
      try {
        console.log(`📦 Rolling back: ${migrationRecord.name}`);
        
        const migrationPath = path.join(this.migrationsPath, migrationRecord.name);
        const migration = require(migrationPath);
        
        await migration.down();
        
        // Remove the migration record
        await this.Migration.deleteOne({ _id: migrationRecord._id });
        
        console.log(`✅ Rollback completed: ${migrationRecord.name}`);
      } catch (error) {
        console.error(`❌ Rollback failed: ${migrationRecord.name}`);
        console.error(error);
        throw error;
      }
    }

    console.log('🎉 Rollback completed!');
  }

  async getNextBatch() {
    const lastMigration = await this.Migration
      .findOne()
      .sort({ batch: -1 });
    
    return lastMigration ? lastMigration.batch + 1 : 1;
  }

  async getStatus() {
    const migrationFiles = await this.getMigrationFiles();
    const executedMigrations = await this.getExecutedMigrations();
    
    console.log('\n📋 Migration Status:');
    console.log('===================');
    
    migrationFiles.forEach(file => {
      const status = executedMigrations.includes(file) ? '✅ Executed' : '⏳ Pending';
      console.log(`${status} ${file}`);
    });
    
    console.log(`\nTotal: ${migrationFiles.length} | Executed: ${executedMigrations.length} | Pending: ${migrationFiles.length - executedMigrations.length}`);
  }
}

module.exports = MigrationManager;