const express = require('express');
const teacherController = require('../controllers/teacherController');
const { authenticateToken, requireRole } = require('../middlewares/auth');

const router = express.Router();

// Apply authentication and teacher role check to all routes
router.use(authenticateToken);
router.use(requireRole(['TEACHER']));

// Class management
router.get('/classes', teacherController.getTeacherClasses);
router.get('/classes/:classId/attendance', teacherController.getClassAttendance);

// Attendance management
router.post('/attendance/mark', teacherController.markAttendance);
router.post('/attendance/open-qr', teacherController.generateQRAttendance);

// Leave request management
router.get('/leaves', teacherController.getPendingLeaves);
router.put('/leaves/:leaveId/review', teacherController.reviewLeaveRequest);

module.exports = router;