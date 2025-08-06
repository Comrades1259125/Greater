import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  Users, 
  BookOpen, 
  BarChart3, 
  TrendingUp,
  UserPlus,
  Plus
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../lib/axios';

const AdminDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    try {
      const response = await api.get('/admin/reports/overview');
      setOverview(response.data.overview);
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการดึงข้อมูลภาพรวม');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      name: 'นักเรียนทั้งหมด',
      value: overview?.totalStudents || 0,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive'
    },
    {
      name: 'อาจารย์ทั้งหมด',
      value: overview?.totalTeachers || 0,
      icon: BookOpen,
      color: 'bg-green-500',
      change: '+5%',
      changeType: 'positive'
    },
    {
      name: 'ชั้นเรียนทั้งหมด',
      value: overview?.totalClasses || 0,
      icon: BarChart3,
      color: 'bg-purple-500',
      change: '+8%',
      changeType: 'positive'
    },
    {
      name: 'อัตราการเข้าเรียน',
      value: `${overview?.attendanceRate || 0}%`,
      icon: TrendingUp,
      color: 'bg-orange-500',
      change: '+2%',
      changeType: 'positive'
    }
  ];

  const attendanceData = [
    { name: 'มาเรียน', value: overview?.attendanceRate || 0, color: '#10b981' },
    { name: 'ขาดเรียน', value: 100 - (overview?.attendanceRate || 0), color: '#ef4444' }
  ];

  const monthlyData = [
    { month: 'ม.ค.', attendance: 85 },
    { month: 'ก.พ.', attendance: 88 },
    { month: 'มี.ค.', attendance: 92 },
    { month: 'เม.ย.', attendance: 90 },
    { month: 'พ.ค.', attendance: 87 },
    { month: 'มิ.ย.', attendance: 94 }
  ];

  if (loading) {
    return (
      <DashboardLayout title="ภาพรวมระบบ">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="ภาพรวมระบบ">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.name} className="card">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
              <div className="mt-4">
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">จากเดือนที่แล้ว</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance Pie Chart */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">อัตราการเข้าเรียน</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attendanceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {attendanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-4 mt-4">
              {attendanceData.map((item) => (
                <div key={item.name} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Attendance Bar Chart */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">การเข้าเรียนรายเดือน</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="attendance" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">การดำเนินการด่วน</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors duration-200">
              <UserPlus className="h-6 w-6 text-gray-400 mr-2" />
              <span className="text-sm font-medium text-gray-600">เพิ่มผู้ใช้ใหม่</span>
            </button>
            <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors duration-200">
              <Plus className="h-6 w-6 text-gray-400 mr-2" />
              <span className="text-sm font-medium text-gray-600">สร้างชั้นเรียนใหม่</span>
            </button>
            <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors duration-200">
              <BarChart3 className="h-6 w-6 text-gray-400 mr-2" />
              <span className="text-sm font-medium text-gray-600">ดูรายงาน</span>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">กิจกรรมล่าสุด</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-sm text-gray-600">นักเรียน 5 คน ได้ลงชื่อเข้าเรียนในชั้นเรียนคณิตศาสตร์</p>
              <span className="text-xs text-gray-400">2 นาทีที่แล้ว</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <p className="text-sm text-gray-600">อาจารย์ สมชาย ได้สร้าง QR Code สำหรับชั้นเรียนวิทยาศาสตร์</p>
              <span className="text-xs text-gray-400">5 นาทีที่แล้ว</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <p className="text-sm text-gray-600">นักเรียน สมหญิง ได้ส่งคำขอลา</p>
              <span className="text-xs text-gray-400">10 นาทีที่แล้ว</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;