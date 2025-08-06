const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@school.com' },
    update: {},
    create: {
      name: 'ผู้ดูแลระบบ',
      email: 'admin@school.com',
      password: adminPassword,
      role: 'ADMIN'
    }
  });

  // Create teacher users
  const teacher1Password = await bcrypt.hash('teacher123', 10);
  const teacher1 = await prisma.user.upsert({
    where: { email: 'teacher1@school.com' },
    update: {},
    create: {
      name: 'อาจารย์ สมชาย ใจดี',
      email: 'teacher1@school.com',
      password: teacher1Password,
      role: 'TEACHER'
    }
  });

  const teacher2Password = await bcrypt.hash('teacher123', 10);
  const teacher2 = await prisma.user.upsert({
    where: { email: 'teacher2@school.com' },
    update: {},
    create: {
      name: 'อาจารย์ สมหญิง รักเรียน',
      email: 'teacher2@school.com',
      password: teacher2Password,
      role: 'TEACHER'
    }
  });

  // Create student users
  const studentPassword = await bcrypt.hash('student123', 10);
  const students = await Promise.all([
    prisma.user.upsert({
      where: { email: 'student1@school.com' },
      update: {},
      create: {
        name: 'นักเรียน สมชาย เรียนดี',
        email: 'student1@school.com',
        password: studentPassword,
        role: 'STUDENT'
      }
    }),
    prisma.user.upsert({
      where: { email: 'student2@school.com' },
      update: {},
      create: {
        name: 'นักเรียน สมหญิง ขยันเรียน',
        email: 'student2@school.com',
        password: studentPassword,
        role: 'STUDENT'
      }
    }),
    prisma.user.upsert({
      where: { email: 'student3@school.com' },
      update: {},
      create: {
        name: 'นักเรียน สมชาย ตั้งใจเรียน',
        email: 'student3@school.com',
        password: studentPassword,
        role: 'STUDENT'
      }
    }),
    prisma.user.upsert({
      where: { email: 'student4@school.com' },
      update: {},
      create: {
        name: 'นักเรียน สมหญิง ใฝ่เรียน',
        email: 'student4@school.com',
        password: studentPassword,
        role: 'STUDENT'
      }
    })
  ]);

  // Create classes
  const class1 = await prisma.class.upsert({
    where: { id: 'class1' },
    update: {},
    create: {
      id: 'class1',
      name: 'คณิตศาสตร์ ม.1/1',
      scheduleInfo: JSON.stringify({ day: 'จันทร์', time: '08:30-09:30' }),
      teacherId: teacher1.id
    }
  });

  const class2 = await prisma.class.upsert({
    where: { id: 'class2' },
    update: {},
    create: {
      id: 'class2',
      name: 'วิทยาศาสตร์ ม.1/1',
      scheduleInfo: JSON.stringify({ day: 'อังคาร', time: '09:30-10:30' }),
      teacherId: teacher2.id
    }
  });

  // Enroll students in classes
  await Promise.all([
    prisma.enrollment.upsert({
      where: { classId_studentId: { classId: class1.id, studentId: students[0].id } },
      update: {},
      create: {
        classId: class1.id,
        studentId: students[0].id
      }
    }),
    prisma.enrollment.upsert({
      where: { classId_studentId: { classId: class1.id, studentId: students[1].id } },
      update: {},
      create: {
        classId: class1.id,
        studentId: students[1].id
      }
    }),
    prisma.enrollment.upsert({
      where: { classId_studentId: { classId: class2.id, studentId: students[2].id } },
      update: {},
      create: {
        classId: class2.id,
        studentId: students[2].id
      }
    }),
    prisma.enrollment.upsert({
      where: { classId_studentId: { classId: class2.id, studentId: students[3].id } },
      update: {},
      create: {
        classId: class2.id,
        studentId: students[3].id
      }
    })
  ]);

  // Create some sample attendance records
  const today = new Date();
  today.setHours(8, 30, 0, 0);

  await Promise.all([
    prisma.attendance.upsert({
      where: { id: 'att1' },
      update: {},
      create: {
        id: 'att1',
        classId: class1.id,
        studentId: students[0].id,
        timestamp: today,
        status: 'PRESENT'
      }
    }),
    prisma.attendance.upsert({
      where: { id: 'att2' },
      update: {},
      create: {
        id: 'att2',
        classId: class1.id,
        studentId: students[1].id,
        timestamp: today,
        status: 'LATE'
      }
    })
  ]);

  // Create sample leave request
  await prisma.leaveRequest.upsert({
    where: { id: 'leave1' },
    update: {},
    create: {
      id: 'leave1',
      studentId: students[0].id,
      fromDate: new Date('2024-01-15'),
      toDate: new Date('2024-01-16'),
      reason: 'ป่วยไข้',
      status: 'PENDING'
    }
  });

  console.log('✅ Database seeded successfully!');
  console.log('📝 Test Accounts:');
  console.log('Admin: admin@school.com / admin123');
  console.log('Teacher: teacher1@school.com / teacher123');
  console.log('Student: student1@school.com / student123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });