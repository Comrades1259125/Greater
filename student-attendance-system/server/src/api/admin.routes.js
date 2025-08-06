const express = require('express');
const adminController = require('../controllers/adminController');
const { authenticateToken, requireRole } = require('../middlewares/auth');

const router = express.Router();

// Apply authentication and admin role check to all routes
router.use(authenticateToken);
router.use(requireRole(['ADMIN']));

// User management routes
router.get('/users', adminController.getUsers);
router.post('/users', adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// Class management routes
router.get('/classes', adminController.getClasses);
router.post('/classes', adminController.createClass);
router.post('/classes/:classId/enrollments', adminController.enrollStudents);

// System overview
router.get('/reports/overview', adminController.getSystemOverview);

module.exports = router;