const express = require('express');
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();

// Rate limiting for login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: { message: 'มีการพยายามเข้าสู่ระบบมากเกินไป กรุณาลองใหม่ในภายหลัง' }
});

// Login route
router.post('/login', loginLimiter, authController.login);

// Get current user profile (protected)
router.get('/me', authenticateToken, authController.getProfile);

module.exports = router;