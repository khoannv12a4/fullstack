const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const {
  registerValidation,
  loginValidation,
  refreshTokenValidation,
  profileUpdateValidation,
  handleValidationErrors
} = require('../validators/authValidator');

const router = express.Router();

// Public routes
router.post('/register', 
  authMiddleware,
  requireRole('admin'),
  registerValidation, 
  handleValidationErrors, 
  authController.register
);

router.post('/login', 
  loginValidation, 
  handleValidationErrors, 
  authController.login
);

router.post('/refresh-token', 
  refreshTokenValidation, 
  handleValidationErrors, 
  authController.refreshToken
);

// Protected routes
router.post('/logout', 
  authMiddleware, 
  authController.logout
);

router.get('/profile', 
  authMiddleware, 
  authController.getProfile
);

router.put('/profile', 
  authMiddleware, 
  profileUpdateValidation, 
  handleValidationErrors, 
  authController.updateProfile
);

router.post('/change-password', 
  authMiddleware, 
  authController.changePassword
);

router.post('/deactivate', 
  authMiddleware, 
  authController.deactivateAccount
);

module.exports = router;