const express = require('express');
const studentController = require('../controllers/studentController');
const { authenticateToken, requireRole } = require('../middlewares/auth');

const router = express.Router();

// Apply authentication and student role check to all routes
router.use(authenticateToken);
router.use(requireRole(['STUDENT']));

// Schedule and attendance
router.get('/schedule', studentController.getSchedule);
router.get('/attendance/history', studentController.getAttendanceHistory);
router.post('/attendance/check-in', studentController.checkIn);

// Leave requests
router.post('/leaves', studentController.submitLeaveRequest);
router.get('/leaves', studentController.getLeaveRequests);

module.exports = router;