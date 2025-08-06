# Student Attendance System - Frontend

ระบบจัดการการเข้าเรียนของนักเรียน - Frontend Application

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Start development server**
```bash
npm run dev
```

The application will start on `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
├── features/           # Feature-specific components
├── hooks/             # Custom React hooks
├── layouts/           # Layout components
├── lib/               # Utility libraries (axios, etc.)
├── pages/             # Page components
├── routes/            # Routing configuration
├── stores/            # Zustand state management
└── index.css          # Global styles
```

## 🎨 UI Components

### Core Components
- **DashboardLayout**: Main layout with sidebar and header
- **ProtectedRoute**: Authentication wrapper
- **LoadingSpinner**: Loading indicator
- **LoginPage**: User authentication

### Role-Based Dashboards
- **AdminDashboard**: System overview and management
- **TeacherDashboard**: Class management and attendance
- **StudentDashboard**: Personal schedule and check-in

## 🔐 Authentication

The application uses JWT tokens for authentication with automatic token management:

- Tokens are stored in localStorage
- Automatic token refresh on API calls
- Automatic logout on 401 responses
- Role-based route protection

## 📱 Features

### Admin Features
- System overview with charts
- User management
- Class management
- System reports

### Teacher Features
- Class overview
- QR code generation for attendance
- Manual attendance marking
- Leave request approval

### Student Features
- Personal schedule view
- Attendance history
- QR code check-in
- Leave request submission

## 🎯 Key Technologies

- **React 18**: UI framework
- **Vite**: Build tool and dev server
- **React Router**: Client-side routing
- **Zustand**: State management
- **Tailwind CSS**: Styling
- **Axios**: HTTP client
- **React Hot Toast**: Notifications
- **Lucide React**: Icons
- **Recharts**: Data visualization

## 🌐 API Integration

The frontend communicates with the backend API through:

- **Base URL**: `/api` (proxied to `http://localhost:5000`)
- **Authentication**: JWT Bearer tokens
- **Error Handling**: Automatic error responses
- **Loading States**: Built-in loading indicators

## 🎨 Styling

### Tailwind CSS Classes
- **Responsive Design**: Mobile-first approach
- **Custom Components**: Pre-built component classes
- **Color Scheme**: Primary blue theme
- **Typography**: Kanit font family

### Custom Classes
```css
.btn-primary    # Primary button styling
.btn-secondary  # Secondary button styling
.btn-danger     # Danger button styling
.card           # Card container styling
.input-field    # Form input styling
```

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment Variables
```env
VITE_API_URL=http://localhost:5000
```

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first design
- Tablet and desktop layouts
- Collapsible sidebar on mobile
- Touch-friendly interactions

## 🔒 Security Features

- **Protected Routes**: Role-based access control
- **Token Management**: Secure token storage
- **Input Validation**: Form validation
- **XSS Protection**: Sanitized inputs

## 🌍 Localization

The entire application is localized in Thai:
- All UI text in Thai
- Date formatting in Thai locale
- Number formatting for Thai users

## 🧪 Testing

### Manual Testing
1. **Admin Login**: `admin@school.com` / `admin123`
2. **Teacher Login**: `teacher1@school.com` / `teacher123`
3. **Student Login**: `student1@school.com` / `student123`

### Test Scenarios
- Login/logout functionality
- Role-based navigation
- QR code generation and scanning
- Attendance marking
- Leave request submission

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Static Host
The built files in `dist/` can be deployed to any static hosting service.

## 📊 Performance

- **Code Splitting**: Automatic route-based splitting
- **Lazy Loading**: Components loaded on demand
- **Optimized Images**: WebP format support
- **Minified Assets**: Production optimization

## 🔧 Troubleshooting

### Common Issues
1. **API Connection**: Ensure backend is running on port 5000
2. **CORS Issues**: Check backend CORS configuration
3. **Build Errors**: Clear node_modules and reinstall
4. **Hot Reload**: Restart dev server if needed

### Debug Mode
Enable debug logging by setting `localStorage.debug = 'app:*'` in browser console.
