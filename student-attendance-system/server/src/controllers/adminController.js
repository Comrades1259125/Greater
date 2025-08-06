const bcrypt = require('bcryptjs');
const prisma = require('../config/database');

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้' });
  }
};

// Create new user
const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'อีเมลนี้มีผู้ใช้งานแล้ว' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'STUDENT'
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    res.status(201).json({ message: 'สร้างผู้ใช้สำเร็จ', user });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการสร้างผู้ใช้' });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        role
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    res.json({ message: 'อัปเดตผู้ใช้สำเร็จ', user });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตผู้ใช้' });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id }
    });

    res.json({ message: 'ลบผู้ใช้สำเร็จ' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบผู้ใช้' });
  }
};

// Get all classes
const getClasses = async (req, res) => {
  try {
    const classes = await prisma.class.findMany({
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
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
    console.error('Get classes error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลชั้นเรียน' });
  }
};

// Create new class
const createClass = async (req, res) => {
  try {
    const { name, scheduleInfo, teacherId } = req.body;

    if (!name || !scheduleInfo || !teacherId) {
      return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
    }

    const classData = await prisma.class.create({
      data: {
        name,
        scheduleInfo,
        teacherId
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(201).json({ message: 'สร้างชั้นเรียนสำเร็จ', class: classData });
  } catch (error) {
    console.error('Create class error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการสร้างชั้นเรียน' });
  }
};

// Enroll students to class
const enrollStudents = async (req, res) => {
  try {
    const { classId } = req.params;
    const { studentIds } = req.body;

    if (!studentIds || !Array.isArray(studentIds)) {
      return res.status(400).json({ message: 'กรุณาระบุรายชื่อนักเรียน' });
    }

    const enrollments = await prisma.enrollment.createMany({
      data: studentIds.map(studentId => ({
        classId,
        studentId
      })),
      skipDuplicates: true
    });

    res.json({ message: 'ลงทะเบียนนักเรียนสำเร็จ', count: enrollments.count });
  } catch (error) {
    console.error('Enroll students error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลงทะเบียนนักเรียน' });
  }
};

// Get system overview
const getSystemOverview = async (req, res) => {
  try {
    const [
      totalStudents,
      totalTeachers,
      totalClasses,
      totalAttendanceRecords
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.user.count({ where: { role: 'TEACHER' } }),
      prisma.class.count(),
      prisma.attendance.count()
    ]);

    // Calculate attendance rate
    const presentRecords = await prisma.attendance.count({
      where: { status: 'PRESENT' }
    });

    const attendanceRate = totalAttendanceRecords > 0 
      ? Math.round((presentRecords / totalAttendanceRecords) * 100) 
      : 0;

    res.json({
      overview: {
        totalStudents,
        totalTeachers,
        totalClasses,
        totalAttendanceRecords,
        attendanceRate
      }
    });
  } catch (error) {
    console.error('Get overview error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลภาพรวม' });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getClasses,
  createClass,
  enrollStudents,
  getSystemOverview
};