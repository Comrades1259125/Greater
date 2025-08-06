import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  Menu, 
  X, 
  Home, 
  Users, 
  BookOpen, 
  Calendar, 
  FileText, 
  BarChart3, 
  Settings, 
  LogOut,
  User,
  QrCode,
  Clock
} from 'lucide-react';
import useAuthStore from '../stores/auth.store';

const DashboardLayout = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('ออกจากระบบสำเร็จ');
    navigate('/login');
  };

  const getMenuItems = () => {
    switch (user?.role) {
      case 'ADMIN':
        return [
          { name: 'ภาพรวม', icon: Home, href: '/', active: true },
          { name: 'จัดการผู้ใช้', icon: Users, href: '/users' },
          { name: 'จัดการชั้นเรียน', icon: BookOpen, href: '/classes' },
          { name: 'รายงาน', icon: BarChart3, href: '/reports' },
          { name: 'ตั้งค่า', icon: Settings, href: '/settings' },
        ];
      case 'TEACHER':
        return [
          { name: 'ภาพรวม', icon: Home, href: '/', active: true },
          { name: 'ชั้นเรียนของฉัน', icon: BookOpen, href: '/classes' },
          { name: 'ลงชื่อเข้าเรียน', icon: QrCode, href: '/attendance' },
          { name: 'คำขอลา', icon: FileText, href: '/leaves' },
          { name: 'รายงาน', icon: BarChart3, href: '/reports' },
        ];
      case 'STUDENT':
        return [
          { name: 'ภาพรวม', icon: Home, href: '/', active: true },
          { name: 'ตารางเรียน', icon: Calendar, href: '/schedule' },
          { name: 'ประวัติการเข้าเรียน', icon: Clock, href: '/attendance' },
          { name: 'คำขอลา', icon: FileText, href: '/leaves' },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">ระบบเข้าเรียน</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  item.active
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </a>
            ))}
          </div>
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role?.toLowerCase()}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors duration-200"
          >
            <LogOut className="mr-3 h-5 w-5" />
            ออกจากระบบ
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {new Date().toLocaleDateString('th-TH', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;