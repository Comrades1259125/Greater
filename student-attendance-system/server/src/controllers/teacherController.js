const prisma = require('../config/database');
const QRCode = require('qrcode');

// Get teacher's classes
const getTeacherClasses = async (req, res) => {
  try {
    const classes = await prisma.class.findMany({
      where: { teacherId: req.user.id },
      include: {
        enrollments: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    res.json({ classes });
  } catch (error) {
    console.error('Get teacher classes error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลชั้นเรียน' });
  }
};

// Get class attendance
const getClassAttendance = async (req, res) => {
  try {
    const { classId } = req.params;
    const { date } = req.query;

    // Verify teacher owns this class
    const classData = await prisma.class.findFirst({
      where: {
        id: classId,
        teacherId: req.user.id
      }
    });

    if (!classData) {
      return res.status(403).json({ message: 'ไม่มีสิทธิ์เข้าถึงชั้นเรียนนี้' });
    }

    const startDate = date ? new Date(date) : new Date();
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setHours(23, 59, 59, 999);

    const attendance = await prisma.attendance.findMany({
      where: {
        classId,
        timestamp: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { timestamp: 'desc' }
    });

    res.json({ attendance });
  } catch (error) {
    console.error('Get class attendance error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลการเข้าเรียน' });
  }
};

// Mark attendance manually
const markAttendance = async (req, res) => {
  try {
    const { classId, studentId, status } = req.body;

    if (!classId || !studentId || !status) {
      return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
    }

    // Verify teacher owns this class
    const classData = await prisma.class.findFirst({
      where: {
        id: classId,
        teacherId: req.user.id
      }
    });

    if (!classData) {
      return res.status(403).json({ message: 'ไม่มีสิทธิ์เข้าถึงชั้นเรียนนี้' });
    }

    // Check if attendance already exists for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        classId,
        studentId,
        timestamp: {
          gte: today,
          lt: tomorrow
        }
      }
    });

    if (existingAttendance) {
      // Update existing attendance
      await prisma.attendance.update({
        where: { id: existingAttendance.id },
        data: { status }
      });
    } else {
      // Create new attendance record
      await prisma.attendance.create({
        data: {
          classId,
          studentId,
          status
        }
      });
    }

    res.json({ message: 'บันทึกการเข้าเรียนสำเร็จ' });
  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการบันทึกการเข้าเรียน' });
  }
};

// Generate QR code for attendance
const generateQRAttendance = async (req, res) => {
  try {
    const { classId } = req.body;

    if (!classId) {
      return res.status(400).json({ message: 'กรุณาระบุชั้นเรียน' });
    }

    // Verify teacher owns this class
    const classData = await prisma.class.findFirst({
      where: {
        id: classId,
        teacherId: req.user.id
      }
    });

    if (!classData) {
      return res.status(403).json({ message: 'ไม่มีสิทธิ์เข้าถึงชั้นเรียนนี้' });
    }

    // Generate unique token for QR code
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const checkInUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/check-in/${token}`;

    // Generate QR code
    const qrCodeDataUrl = await QRCode.toDataURL(checkInUrl);

    res.json({
      message: 'สร้าง QR Code สำเร็จ',
      qrCode: qrCodeDataUrl,
      checkInUrl,
      token
    });
  } catch (error) {
    console.error('Generate QR error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการสร้าง QR Code' });
  }
};

// Get pending leave requests
const getPendingLeaves = async (req, res) => {
  try {
    const leaveRequests = await prisma.leaveRequest.findMany({
      where: {
        status: 'PENDING',
        student: {
          enrollments: {
            some: {
              class: {
                teacherId: req.user.id
              }
            }
          }
        }
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { fromDate: 'asc' }
    });

    res.json({ leaveRequests });
  } catch (error) {
    console.error('Get pending leaves error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลคำขอลา' });
  }
};

// Review leave request
const reviewLeaveRequest = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const { status } = req.body;

    if (!status || !['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ message: 'กรุณาระบุสถานะที่ถูกต้อง' });
    }

    // Verify teacher can review this leave request
    const leaveRequest = await prisma.leaveRequest.findFirst({
      where: {
        id: leaveId,
        status: 'PENDING',
        student: {
          enrollments: {
            some: {
              class: {
                teacherId: req.user.id
              }
            }
          }
        }
      }
    });

    if (!leaveRequest) {
      return res.status(403).json({ message: 'ไม่มีสิทธิ์ในการตรวจสอบคำขอนี้' });
    }

    await prisma.leaveRequest.update({
      where: { id: leaveId },
      data: {
        status,
        reviewedById: req.user.id,
        reviewedAt: new Date()
      }
    });

    res.json({ message: 'อัปเดตสถานะคำขอสำเร็จ' });
  } catch (error) {
    console.error('Review leave request error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตสถานะคำขอ' });
  }
};

module.exports = {
  getTeacherClasses,
  getClassAttendance,
  markAttendance,
  generateQRAttendance,
  getPendingLeaves,
  reviewLeaveRequest
};