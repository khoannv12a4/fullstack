const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'user'],
    default: 'user'
  },
  permissions: [{
    type: String,
    enum: [
      // User permissions
      'profile:read', 'profile:update',
      // Manager permissions  
      'users:read', 'users:update', 'content:manage',
      // Admin permissions
      'users:delete', 'system:manage', 'roles:manage'
    ]
  }],
  refreshTokens: [{
    token: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 604800 // 7 days in seconds
    }
  }],
  profile: {
    firstName: String,
    lastName: String,
    avatar: String,
    bio: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLoginAt: Date
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.refreshTokens;
      return ret;
    }
  }
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ role: 1 });
userSchema.index({ permissions: 1 });
userSchema.index({ 'refreshTokens.token': 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(config.BCRYPT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Add refresh token
userSchema.methods.addRefreshToken = async function(token) {
  // Limit number of refresh tokens per user
  if (this.refreshTokens.length >= 5) {
    this.refreshTokens.shift(); // Remove oldest token
  }
  
  this.refreshTokens.push({ token });
  await this.save();
};

// Remove refresh token
userSchema.methods.removeRefreshToken = async function(token) {
  this.refreshTokens = this.refreshTokens.filter(
    tokenObj => tokenObj.token !== token
  );
  await this.save();
};

// Clear all refresh tokens
userSchema.methods.clearRefreshTokens = async function() {
  this.refreshTokens = [];
  await this.save();
};

// Update last login
userSchema.methods.updateLastLogin = async function() {
  this.lastLoginAt = new Date();
  await this.save();
};

// Role and permission methods
userSchema.methods.hasRole = function(role) {
  return this.role === role;
};

userSchema.methods.hasPermission = function(permission) {
  return this.permissions.includes(permission);
};

userSchema.methods.hasAnyPermission = function(permissions) {
  return permissions.some(permission => this.permissions.includes(permission));
};

userSchema.methods.hasAllPermissions = function(permissions) {
  return permissions.every(permission => this.permissions.includes(permission));
};

userSchema.methods.addPermission = async function(permission) {
  if (!this.permissions.includes(permission)) {
    this.permissions.push(permission);
    await this.save();
  }
};

userSchema.methods.removePermission = async function(permission) {
  this.permissions = this.permissions.filter(p => p !== permission);
  await this.save();
};

userSchema.methods.setRole = async function(role) {
  this.role = role;
  // Set default permissions based on role
  this.permissions = this.getDefaultPermissions(role);
  await this.save();
};

userSchema.methods.getDefaultPermissions = function(role) {
  const rolePermissions = {
    'user': ['profile:read', 'profile:update'],
    'manager': [
      'profile:read', 'profile:update',
      'users:read', 'users:update', 'content:manage'
    ],
    'admin': [
      'profile:read', 'profile:update',
      'users:read', 'users:update', 'users:delete',
      'content:manage', 'system:manage', 'roles:manage'
    ]
  };
  
  return rolePermissions[role] || rolePermissions['user'];
};

userSchema.methods.isAdmin = function() {
  return this.role === 'admin';
};

userSchema.methods.isManager = function() {
  return this.role === 'manager';
};

userSchema.methods.isUser = function() {
  return this.role === 'user';
};

module.exports = mongoose.model('User', userSchema);