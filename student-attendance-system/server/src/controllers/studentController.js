const prisma = require('../config/database');

// Get student's schedule
const getSchedule = async (req, res) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId: req.user.id },
      include: {
        class: {
          include: {
            teacher: {
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

    const schedule = enrollments.map(enrollment => ({
      classId: enrollment.class.id,
      className: enrollment.class.name,
      scheduleInfo: enrollment.class.scheduleInfo,
      teacher: enrollment.class.teacher
    }));

    res.json({ schedule });
  } catch (error) {
    console.error('Get schedule error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลตารางเรียน' });
  }
};

// Get student's attendance history
const getAttendanceHistory = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const whereClause = {
      studentId: req.user.id
    };

    if (startDate && endDate) {
      whereClause.timestamp = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }

    const attendance = await prisma.attendance.findMany({
      where: whereClause,
      include: {
        class: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { timestamp: 'desc' }
    });

    // Calculate attendance statistics
    const totalRecords = attendance.length;
    const presentRecords = attendance.filter(record => record.status === 'PRESENT').length;
    const lateRecords = attendance.filter(record => record.status === 'LATE').length;
    const absentRecords = attendance.filter(record => record.status === 'ABSENT').length;
    const onLeaveRecords = attendance.filter(record => record.status === 'ON_LEAVE').length;

    const attendanceRate = totalRecords > 0 ? Math.round((presentRecords / totalRecords) * 100) : 0;

    res.json({
      attendance,
      statistics: {
        total: totalRecords,
        present: presentRecords,
        late: lateRecords,
        absent: absentRecords,
        onLeave: onLeaveRecords,
        attendanceRate
      }
    });
  } catch (error) {
    console.error('Get attendance history error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลประวัติการเข้าเรียน' });
  }
};

// Student check-in
const checkIn = async (req, res) => {
  try {
    const { classId, token } = req.body;

    if (!classId || !token) {
      return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
    }

    // Verify student is enrolled in this class
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        classId,
        studentId: req.user.id
      }
    });

    if (!enrollment) {
      return res.status(403).json({ message: 'คุณไม่ได้ลงทะเบียนในชั้นเรียนนี้' });
    }

    // Check if already checked in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        classId,
        studentId: req.user.id,
        timestamp: {
          gte: today,
          lt: tomorrow
        }
      }
    });

    if (existingAttendance) {
      return res.status(400).json({ message: 'คุณได้ลงชื่อเข้าเรียนแล้ววันนี้' });
    }

    // Determine if student is late (after 15 minutes from class start)
    const scheduleInfo = JSON.parse(enrollment.class.scheduleInfo);
    const classStartTime = new Date();
    classStartTime.setHours(parseInt(scheduleInfo.time.split(':')[0]), parseInt(scheduleInfo.time.split(':')[1]), 0, 0);
    
    const now = new Date();
    const isLate = now > new Date(classStartTime.getTime() + 15 * 60 * 1000); // 15 minutes late

    // Create attendance record
    await prisma.attendance.create({
      data: {
        classId,
        studentId: req.user.id,
        status: isLate ? 'LATE' : 'PRESENT'
      }
    });

    res.json({ 
      message: isLate ? 'ลงชื่อเข้าเรียนสำเร็จ (สาย)' : 'ลงชื่อเข้าเรียนสำเร็จ',
      status: isLate ? 'LATE' : 'PRESENT'
    });
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลงชื่อเข้าเรียน' });
  }
};

// Submit leave request
const submitLeaveRequest = async (req, res) => {
  try {
    const { fromDate, toDate, reason, attachmentUrl } = req.body;

    if (!fromDate || !toDate || !reason) {
      return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
    }

    const leaveRequest = await prisma.leaveRequest.create({
      data: {
        studentId: req.user.id,
        fromDate: new Date(fromDate),
        toDate: new Date(toDate),
        reason,
        attachmentUrl
      }
    });

    res.status(201).json({ 
      message: 'ส่งคำขอลาสำเร็จ',
      leaveRequest
    });
  } catch (error) {
    console.error('Submit leave request error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการส่งคำขอลา' });
  }
};

// Get student's leave requests
const getLeaveRequests = async (req, res) => {
  try {
    const leaveRequests = await prisma.leaveRequest.findMany({
      where: { studentId: req.user.id },
      include: {
        reviewedBy: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { fromDate: 'desc' }
    });

    res.json({ leaveRequests });
  } catch (error) {
    console.error('Get leave requests error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลคำขอลา' });
  }
};

module.exports = {
  getSchedule,
  getAttendanceHistory,
  checkIn,
  submitLeaveRequest,
  getLeaveRequests
};