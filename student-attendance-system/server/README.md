# Student Attendance System - Backend API

ระบบจัดการการเข้าเรียนของนักเรียน - Backend API

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. **Set up database**
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database with sample data
npm run db:seed
```

4. **Start development server**
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## 📊 Database Schema

### Models
- **User**: Students, teachers, and admins
- **Class**: Course information and schedules
- **Enrollment**: Student-class relationships
- **Attendance**: Daily attendance records
- **LeaveRequest**: Student leave applications
- **Holiday**: School holiday calendar

### Roles
- `STUDENT`: Can view schedule, check-in, submit leave requests
- `TEACHER`: Can manage classes, mark attendance, review leaves
- `ADMIN`: Full system access and user management

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

### Admin Routes (ADMIN role required)
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create new user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/classes` - Get all classes
- `POST /api/admin/classes` - Create new class
- `POST /api/admin/classes/:classId/enrollments` - Enroll students
- `GET /api/admin/reports/overview` - System statistics

### Teacher Routes (TEACHER role required)
- `GET /api/teacher/classes` - Get teacher's classes
- `GET /api/teacher/classes/:classId/attendance` - Get class attendance
- `POST /api/teacher/attendance/mark` - Mark attendance manually
- `POST /api/teacher/attendance/open-qr` - Generate QR code
- `GET /api/teacher/leaves` - Get pending leave requests
- `PUT /api/teacher/leaves/:leaveId/review` - Review leave request

### Student Routes (STUDENT role required)
- `GET /api/student/schedule` - Get student's schedule
- `GET /api/student/attendance/history` - Get attendance history
- `POST /api/student/attendance/check-in` - Check-in for class
- `POST /api/student/leaves` - Submit leave request
- `GET /api/student/leaves` - Get leave requests

## 🧪 Test Accounts

After running the seed script, you can use these test accounts:

### Admin
- Email: `admin@school.com`
- Password: `admin123`

### Teacher
- Email: `teacher1@school.com`
- Password: `teacher123`

### Student
- Email: `student1@school.com`
- Password: `student123`

## 🔧 Development

### Available Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed database with sample data

### Environment Variables
```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
JWT_SECRET="your-super-secret-jwt-key"
PORT=5000
NODE_ENV=development
CLIENT_URL="http://localhost:3000"
```

## 🛡️ Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Prevent abuse
- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt for password security
- **Input Validation**: Request validation
- **Role-based Access Control**: RBAC implementation

## 📝 Error Handling

All API responses follow a consistent format:
```json
{
  "message": "ข้อความแจ้งเตือน",
  "data": {}, // Optional data
  "error": "error_code" // Optional error code
}
```

## 🔍 Health Check

Check server status:
```bash
curl http://localhost:5000/health
```

Response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```