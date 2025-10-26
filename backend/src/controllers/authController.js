const authService = require('../services/authService');

class AuthController {
  async register(req, res) {
    try {
      const result = await authService.register(req.body);
      
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result
      });
    } catch (error) {
      console.error('Register error:', error);
      
      if (error.message.includes('already exists') || error.message.includes('E11000')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Server error during registration'
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);

      res.json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.message === 'Invalid credentials' || error.message === 'Account is deactivated') {
        return res.status(401).json({
          success: false,
          message: error.message
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Server error during login'
      });
    }
  }

  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;
      const result = await authService.refreshToken(refreshToken);

      res.json({
        success: true,
        message: 'Tokens refreshed successfully',
        data: result
      });
    } catch (error) {
      console.error('Refresh token error:', error);
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Refresh token expired'
        });
      }
      
      res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }
  }

  async logout(req, res) {
    try {
      const { refreshToken } = req.body;
      await authService.logout(req.user.id, refreshToken);

      res.json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during logout'
      });
    }
  }

  async getProfile(req, res) {
    try {
      const user = await authService.getUserProfile(req.user.id);

      res.json({
        success: true,
        data: { user }
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }

  async updateProfile(req, res) {
    try {
      const user = await authService.updateProfile(req.user.id, req.body);

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: { user }
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during profile update'
      });
    }
  }

  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const result = await authService.changePassword(req.user.id, currentPassword, newPassword);

      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      console.error('Change password error:', error);
      
      if (error.message === 'Current password is incorrect') {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Server error during password change'
      });
    }
  }

  async deactivateAccount(req, res) {
    try {
      const result = await authService.deactivateAccount(req.user.id);

      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      console.error('Deactivate account error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during account deactivation'
      });
    }
  }
}

module.exports = new AuthController();