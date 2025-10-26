const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

// Get dashboard stats
router.get('/stats', auth, async (req, res) => {
  try {
    const User = require('../models/User');
    
    // Get basic statistics
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const activeUsers = await User.countDocuments({ 
      lastLoginAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
    });

    res.json({
      success: true,
      message: 'Dashboard stats retrieved successfully',
      data: {
        users: totalUsers,
        admins: adminUsers,
        activeSessions: activeUsers,
        systemStatus: 'Online',
        pendingTasks: 0
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

module.exports = router;