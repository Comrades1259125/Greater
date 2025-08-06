import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import useAuthStore from './stores/auth.store';

// Pages
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import CheckInPage from './pages/CheckInPage';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const { user, isAuthenticated, getProfile } = useAuthStore();

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('token');
    if (token && !isAuthenticated) {
      getProfile();
    }
  }, [getProfile, isAuthenticated]);

  const getDashboardByRole = () => {
    if (!user) return <Navigate to="/login" />;
    
    switch (user.role) {
      case 'ADMIN':
        return <AdminDashboard />;
      case 'TEACHER':
        return <TeacherDashboard />;
      case 'STUDENT':
        return <StudentDashboard />;
      default:
        return <Navigate to="/login" />;
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/check-in/:token" element={<CheckInPage />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                {getDashboardByRole()}
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
