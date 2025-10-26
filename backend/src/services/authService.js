const User = require('../models/User');
const { generateTokens } = require('../utils/tokens');

class AuthService {
  async register(userData) {
    const { username, email, password, role } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      throw new Error('User with this email or username already exists');
    }

    // Create new user
    const user = new User({ 
      username, 
      email, 
      password,
      role: role || 'user'
    });
    await user.save();

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);
    
    // Save refresh token to user
    await user.addRefreshToken(refreshToken);

    return {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        profile: user.profile,
        createdAt: user.createdAt
      },
      accessToken,
      refreshToken
    };
  }

  async login(email, password) {
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Update last login
    await user.updateLastLogin();

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);
    
    // Save refresh token to user
    await user.addRefreshToken(refreshToken);

    return {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        profile: user.profile,
        lastLoginAt: user.lastLoginAt
      },
      accessToken,
      refreshToken
    };
  }

  async refreshToken(refreshToken) {
    const { verifyRefreshToken } = require('../utils/tokens');
    
    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    
    // Find user and check if refresh token exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    // Check if refresh token exists in user's token list
    const tokenExists = user.refreshTokens.some(
      tokenObj => tokenObj.token === refreshToken
    );

    if (!tokenExists) {
      throw new Error('Invalid refresh token');
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id);
    
    // Remove old refresh token and add new one
    await user.removeRefreshToken(refreshToken);
    await user.addRefreshToken(newRefreshToken);

    return {
      accessToken,
      refreshToken: newRefreshToken
    };
  }

  async logout(userId, refreshToken) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (refreshToken) {
      await user.removeRefreshToken(refreshToken);
    }

    return { message: 'Logout successful' };
  }

  async getUserProfile(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
      profile: user.profile,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  async updateProfile(userId, profileData) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Update profile fields
    if (profileData.firstName !== undefined) {
      user.profile.firstName = profileData.firstName;
    }
    if (profileData.lastName !== undefined) {
      user.profile.lastName = profileData.lastName;
    }
    if (profileData.bio !== undefined) {
      user.profile.bio = profileData.bio;
    }
    if (profileData.avatar !== undefined) {
      user.profile.avatar = profileData.avatar;
    }

    await user.save();

    return this.getUserProfile(userId);
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Clear all refresh tokens for security
    await user.clearRefreshTokens();

    return { message: 'Password changed successfully' };
  }

  async deactivateAccount(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.isActive = false;
    await user.clearRefreshTokens();
    await user.save();

    return { message: 'Account deactivated successfully' };
  }
}

module.exports = new AuthService();