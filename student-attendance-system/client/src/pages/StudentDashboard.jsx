import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  QrCode,
  FileText,
  TrendingUp
} from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../lib/axios';

const StudentDashboard = () => {
  const [schedule, setSchedule] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [todayClasses, setTodayClasses] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [scheduleResponse, attendanceResponse] = await Promise.all([
        api.get('/student/schedule'),
        api.get('/student/attendance/history')
      ]);
      
      setSchedule(scheduleResponse.data.schedule);
      setAttendanceStats(attendanceResponse.data.statistics);
      
      // Filter today's classes
      const today = new Date().getDay();
      const dayNames = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
      const todayClasses = scheduleResponse.data.schedule.filter(cls => {
        const scheduleInfo = JSON.parse(cls.scheduleInfo);
        return scheduleInfo.day === dayNames[today];
      });
      setTodayClasses(todayClasses);
      
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการดึงข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (classId) => {
    try {
      await api.post('/student/attendance/check-in', { 
        classId, 
        token: 'sample-token' 
      });
      toast.success('ลงชื่อเข้าเรียนสำเร็จ');
      fetchData(); // Refresh data
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการลงชื่อเข้าเรียน');
    }
  };

  const getAttendanceStatusColor = (status) => {
    switch (status) {
      case 'PRESENT':
        return 'bg-green-100 text-green-800';
      case 'LATE':
        return 'bg-yellow-100 text-yellow-800';
      case 'ABSENT':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="ภาพรวมนักเรียน">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="ภาพรวมนักเรียน">
      <div className="space-y-6">
        {/* Attendance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-500">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">มาเรียน</p>
                <p className="text-2xl font-bold text-gray-900">{attendanceStats?.present || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-500">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">สาย</p>
                <p className="text-2xl font-bold text-gray-900">{attendanceStats?.late || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-red-500">
                <XCircle className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">ขาด</p>
                <p className="text-2xl font-bold text-gray-900">{attendanceStats?.absent || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-500">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">อัตราการเข้าเรียน</p>
                <p className="text-2xl font-bold text-gray-900">{attendanceStats?.attendanceRate || 0}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">ตารางเรียนวันนี้</h3>
          {todayClasses.length > 0 ? (
            <div className="space-y-4">
              {todayClasses.map((cls) => (
                <div key={cls.classId} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-lg bg-primary-100">
                      <Calendar className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{cls.className}</h4>
                      <p className="text-sm text-gray-600">
                        {JSON.parse(cls.scheduleInfo).time} - อาจารย์ {cls.teacher.name}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCheckIn(cls.classId)}
                    className="btn-primary text-sm px-4 py-2"
                  >
                    <QrCode className="h-4 w-4 mr-1" />
                    ลงชื่อเข้าเรียน
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">ไม่มีชั้นเรียนในวันนี้</p>
            </div>
          )}
        </div>

        {/* Recent Attendance */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">ประวัติการเข้าเรียนล่าสุด</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="table-header">วันที่</th>
                  <th className="table-header">ชั้นเรียน</th>
                  <th className="table-header">สถานะ</th>
                  <th className="table-header">เวลา</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="table-cell">15 ม.ค. 2024</td>
                  <td className="table-cell">คณิตศาสตร์ ม.1/1</td>
                  <td className="table-cell">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAttendanceStatusColor('PRESENT')}`}>
                      มาเรียน
                    </span>
                  </td>
                  <td className="table-cell">08:30</td>
                </tr>
                <tr>
                  <td className="table-cell">14 ม.ค. 2024</td>
                  <td className="table-cell">วิทยาศาสตร์ ม.1/1</td>
                  <td className="table-cell">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAttendanceStatusColor('LATE')}`}>
                      สาย
                    </span>
                  </td>
                  <td className="table-cell">09:45</td>
                </tr>
                <tr>
                  <td className="table-cell">13 ม.ค. 2024</td>
                  <td className="table-cell">คณิตศาสตร์ ม.1/1</td>
                  <td className="table-cell">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAttendanceStatusColor('ABSENT')}`}>
                      ขาด
                    </span>
                  </td>
                  <td className="table-cell">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">การดำเนินการด่วน</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors duration-200">
                <QrCode className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-600">สแกน QR Code</span>
              </button>
              <button className="w-full flex items-center justify-center p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors duration-200">
                <FileText className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-600">ส่งคำขอลา</span>
              </button>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">คำขอลาล่าสุด</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">ป่วยไข้</p>
                  <p className="text-sm text-gray-600">15-16 ม.ค. 2024</p>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                  รอการอนุมัติ
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;