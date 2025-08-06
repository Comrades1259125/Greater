# Student Attendance System

ระบบจัดการการเข้าเรียนของนักเรียน - Complete Web Application

A comprehensive, production-ready web application for managing student attendance with role-based access control, QR code check-in, and real-time reporting.

## 🏗️ Architecture

This is a monorepo containing:

- **Backend**: Node.js + Express + PostgreSQL + Prisma
- **Frontend**: React + Vite + Tailwind CSS + Zustand

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd student-attendance-system
```

2. **Set up the backend**
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

3. **Set up the frontend**
```bash
cd ../client
npm install
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🧪 Test Accounts

After running the seed script, you can use these test accounts:

### Admin
- **Email**: `admin@school.com`
- **Password**: `admin123`
- **Features**: System management, user management, reports

### Teacher
- **Email**: `teacher1@school.com`
- **Password**: `teacher123`
- **Features**: Class management, attendance tracking, QR generation

### Student
- **Email**: `student1@school.com`
- **Password**: `student123`
- **Features**: Schedule view, check-in, leave requests

## 📊 Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (ADMIN, TEACHER, STUDENT)
- Secure password hashing with bcrypt
- Automatic token management

### 👨‍💼 Admin Features
- **Dashboard**: System overview with charts and statistics
- **User Management**: Create, update, delete users
- **Class Management**: Create classes and assign teachers
- **Reports**: System-wide attendance reports
- **Student Enrollment**: Bulk student enrollment

### 👨‍🏫 Teacher Features
- **Class Overview**: View assigned classes and students
- **QR Code Generation**: Create QR codes for attendance
- **Manual Attendance**: Mark attendance manually
- **Leave Management**: Approve/reject student leave requests
- **Attendance Reports**: View class-specific reports

### 👨‍🎓 Student Features
- **Personal Schedule**: View daily class schedule
- **QR Check-in**: Scan QR codes to mark attendance
- **Attendance History**: View personal attendance records
- **Leave Requests**: Submit and track leave requests
- **Statistics**: Personal attendance statistics

### 📱 Modern UI/UX
- **Responsive Design**: Mobile-first approach
- **Thai Localization**: Complete Thai language support
- **Real-time Notifications**: Toast notifications for actions
- **Loading States**: Smooth loading indicators
- **Data Visualization**: Charts and graphs for reports

### 🔒 Security Features
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Prevent abuse
- **Input Validation**: Request validation
- **SQL Injection Protection**: Prisma ORM

## 🗄️ Database Schema

### Core Models
- **User**: Students, teachers, and admins
- **Class**: Course information and schedules
- **Enrollment**: Student-class relationships
- **Attendance**: Daily attendance records
- **LeaveRequest**: Student leave applications
- **Holiday**: School holiday calendar

### Relationships
- Teachers can have multiple classes
- Students can be enrolled in multiple classes
- Attendance records link students to classes
- Leave requests are reviewed by teachers

## 🔧 Development

### Backend Scripts
```bash
cd server
npm run dev          # Start development server
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio
```

### Frontend Scripts
```bash
cd client
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

### Admin Routes
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create new user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/classes` - Get all classes
- `POST /api/admin/classes` - Create new class
- `GET /api/admin/reports/overview` - System statistics

### Teacher Routes
- `GET /api/teacher/classes` - Get teacher's classes
- `GET /api/teacher/classes/:classId/attendance` - Get class attendance
- `POST /api/teacher/attendance/mark` - Mark attendance manually
- `POST /api/teacher/attendance/open-qr` - Generate QR code
- `GET /api/teacher/leaves` - Get pending leave requests
- `PUT /api/teacher/leaves/:leaveId/review` - Review leave request

### Student Routes
- `GET /api/student/schedule` - Get student's schedule
- `GET /api/student/attendance/history` - Get attendance history
- `POST /api/student/attendance/check-in` - Check-in for class
- `POST /api/student/leaves` - Submit leave request
- `GET /api/student/leaves` - Get leave requests

## 🎨 UI Components

### Core Components
- **DashboardLayout**: Main layout with sidebar and header
- **ProtectedRoute**: Authentication wrapper
- **LoadingSpinner**: Loading indicator
- **LoginPage**: User authentication

### Role-Based Dashboards
- **AdminDashboard**: System overview with charts
- **TeacherDashboard**: Class management and attendance
- **StudentDashboard**: Personal schedule and check-in

## 🔒 Security

### Backend Security
- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt for password security
- **Rate Limiting**: Prevent abuse
- **CORS**: Cross-origin resource sharing
- **Helmet**: Security headers
- **Input Validation**: Request validation

### Frontend Security
- **Protected Routes**: Role-based access control
- **Token Management**: Secure token storage
- **XSS Protection**: Sanitized inputs
- **HTTPS**: Secure communication

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first design
- Tablet and desktop layouts
- Collapsible sidebar on mobile
- Touch-friendly interactions
- Optimized for all screen sizes

## 🌍 Localization

Complete Thai language support:
- All UI text in Thai
- Date formatting in Thai locale
- Number formatting for Thai users
- Thai font (Kanit) integration

## 🚀 Deployment

### Backend Deployment
1. Set up PostgreSQL database
2. Configure environment variables
3. Run database migrations
4. Deploy to your preferred hosting service

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `dist/` folder to any static hosting service

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
JWT_SECRET="your-super-secret-jwt-key"
PORT=5000
NODE_ENV=development
CLIENT_URL="http://localhost:3000"
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
```

## 📊 Performance

### Backend Performance
- **Database Optimization**: Efficient queries with Prisma
- **Caching**: Response caching where appropriate
- **Compression**: Gzip compression for responses
- **Rate Limiting**: Prevent abuse

### Frontend Performance
- **Code Splitting**: Automatic route-based splitting
- **Lazy Loading**: Components loaded on demand
- **Optimized Assets**: Minified and compressed
- **Caching**: Browser caching strategies

## 🧪 Testing

### Manual Testing Scenarios
1. **Authentication**: Login/logout with different roles
2. **Admin Features**: User and class management
3. **Teacher Features**: QR generation and attendance marking
4. **Student Features**: Check-in and leave requests
5. **Responsive Design**: Test on different screen sizes

### API Testing
- Use tools like Postman or curl
- Test all endpoints with proper authentication
- Verify error handling and validation

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection**
   - Ensure PostgreSQL is running
   - Check database credentials in .env
   - Run `npm run db:push` to sync schema

2. **CORS Issues**
   - Check CORS configuration in backend
   - Ensure frontend URL is in allowed origins

3. **Authentication Issues**
   - Clear localStorage and try logging in again
   - Check JWT secret configuration
   - Verify token expiration

4. **Build Errors**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify all dependencies are installed

## 📈 Future Enhancements

### Planned Features
- **Real-time Updates**: WebSocket integration
- **Push Notifications**: Browser notifications
- **Mobile App**: React Native version
- **Advanced Analytics**: Detailed reporting
- **Integration**: LMS integration
- **Multi-language**: Additional language support

### Technical Improvements
- **TypeScript**: Full TypeScript migration
- **Testing**: Unit and integration tests
- **CI/CD**: Automated deployment pipeline
- **Monitoring**: Application monitoring
- **Documentation**: API documentation

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation in each directory
- Review the troubleshooting section

---

**Built with ❤️ for educational institutions**